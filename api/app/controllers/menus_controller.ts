import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Menu from '#models/menu'
import MenuItem from '#models/menu_item'
import { createMenuValidator, syncMenuItemsValidator, updateMenuValidator } from '#validators/menu'

type MenuItemPayload = {
  id?: number
  parentId?: number | null
  title: string
  url?: string
  type?: 'CUSTOM' | 'PAGE' | 'POST' | 'CATEGORY' | 'TAG'
  referenceId?: number | null
  target?: '_self' | '_blank'
  cssClass?: string
  rel?: string
  sortOrder?: number
}

export default class MenusController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const q = request.input('q') || request.input('search')

    const query = Menu.query()
      .whereNull('deleted_at')
      .orderBy('is_default', 'desc')
      .orderBy('name', 'asc')

    if (q) {
      query.where((builder) => {
        builder.where('name', 'like', `%${q}%`).orWhere('slug', 'like', `%${q}%`)
      })
    }

    if (page || limit) {
      const menus = await query.paginate(Number(page ?? 1), Number(limit ?? 20))
      return response.ok(menus)
    }

    const menus = await query
    return response.ok({ data: menus })
  }

  async store({ request, response }: HttpContext) {
    const { items = [], isDefault, ...payload } = await request.validateUsing(createMenuValidator)

    if (isDefault) {
      await Menu.query().where('is_default', true).update({ is_default: false })
    }

    const menu = await Menu.create({ ...payload, isDefault: isDefault ?? false })
    await this.syncItems(menu, items)
    await menu.load('items', (query) => query.orderBy('sort_order', 'asc'))

    return response.created({ data: menu })
  }

  async show({ params, response }: HttpContext) {
    const menu = await Menu.query()
      .where((builder) => {
        builder.where('id', params.id).orWhere('slug', params.id)
      })
      .whereNull('deleted_at')
      .preload('items', (query) => query.orderBy('sort_order', 'asc').orderBy('id', 'asc'))
      .firstOrFail()

    return response.ok({ data: menu })
  }

  async defaultMenu({ response }: HttpContext) {
    const menu = await Menu.query()
      .where('is_default', true)
      .whereNull('deleted_at')
      .preload('items', (query) => query.orderBy('sort_order', 'asc').orderBy('id', 'asc'))
      .firstOrFail()

    return response.ok({ data: menu })
  }

  async update({ params, request, response }: HttpContext) {
    const menu = await Menu.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    const {
      items,
      isDefault,
      params: validatorParams,
      ...payload
    } = await request.validateUsing(updateMenuValidator, {
      meta: { params },
    })
    void validatorParams

    if (isDefault) {
      await Menu.query().whereNot('id', menu.id).where('is_default', true).update({
        is_default: false,
      })
    }

    menu.merge(payload)
    if (isDefault !== undefined) menu.isDefault = isDefault
    await menu.save()

    if (items) {
      await this.syncItems(menu, items)
    }

    await menu.load('items', (query) => query.orderBy('sort_order', 'asc').orderBy('id', 'asc'))
    return response.ok({ data: menu })
  }

  async setDefault({ params, response }: HttpContext) {
    const menu = await Menu.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    await Menu.query().where('is_default', true).update({ is_default: false })
    menu.isDefault = true
    await menu.save()
    await menu.load('items', (query) => query.orderBy('sort_order', 'asc').orderBy('id', 'asc'))
    return response.ok({ data: menu })
  }

  async syncItemsAction({ params, request, response }: HttpContext) {
    const menu = await Menu.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    const { items } = await request.validateUsing(syncMenuItemsValidator)
    await this.syncItems(menu, items)
    await menu.load('items', (query) => query.orderBy('sort_order', 'asc').orderBy('id', 'asc'))
    return response.ok({ data: menu })
  }

  async destroy({ params, response }: HttpContext) {
    const menu = await Menu.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    menu.deletedAt = DateTime.utc()
    menu.isDefault = false
    await menu.save()
    return response.noContent()
  }

  private async syncItems(menu: Menu, items: MenuItemPayload[]) {
    await MenuItem.query().where('menu_id', menu.id).delete()

    const idMap = new Map<number, number>()
    const created: Array<{ item: MenuItem; payload: MenuItemPayload }> = []

    for (const [index, payload] of items.entries()) {
      const item = await MenuItem.create({
        menuId: menu.id,
        parentId: null,
        title: payload.title,
        url: payload.url || null,
        type: payload.type ?? 'CUSTOM',
        referenceId: payload.referenceId ?? null,
        target: payload.target ?? '_self',
        cssClass: payload.cssClass || null,
        rel: payload.rel || null,
        sortOrder: payload.sortOrder ?? index,
      })

      if (payload.id !== undefined) {
        idMap.set(payload.id, item.id)
      }
      created.push({ item, payload })
    }

    for (const { item, payload } of created) {
      if (payload.parentId !== undefined && payload.parentId !== null && idMap.has(payload.parentId)) {
        item.parentId = idMap.get(payload.parentId!) ?? null
        await item.save()
      }
    }
  }
}
