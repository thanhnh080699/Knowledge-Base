import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import Permission from '#models/permission'
import { DateTime } from 'luxon'
import { createRoleValidator, updateRoleValidator } from '#validators/role'

function applyDeletedFilter(query: ReturnType<typeof Role.query>, status: string) {
  if (status === 'deleted') {
    query.whereNotNull('deleted_at')
    return
  }

  if (status !== 'all') {
    query.whereNull('deleted_at')
  }
}

export default class RolesController {
  async meta({ response }: HttpContext) {
    const permissions = await Permission.query()
      .whereNull('deleted_at')
      .orderBy('module', 'asc')
      .orderBy('name', 'asc')
    return response.ok({ data: { permissions } })
  }

  async index({ request, response }: HttpContext) {
    const q = request.input('q', '').trim().toLowerCase()
    const status = request.input('status', 'active')
    const permissionId = request.input('permissionId')

    const query = Role.query().preload('permissions').preload('users').orderBy('name', 'asc')

    applyDeletedFilter(query, status)

    if (q) {
      query.where((builder) => {
        builder
          .whereRaw('LOWER(name) LIKE ?', [`%${q}%`])
          .orWhereRaw('LOWER(slug) LIKE ?', [`%${q}%`])
          .orWhereRaw("LOWER(COALESCE(description, '')) LIKE ?", [`%${q}%`])
      })
    }

    if (permissionId) {
      query.whereHas('permissions', (permissionQuery) => {
        permissionQuery.where('permissions.id', permissionId)
      })
    }

    const roles = await query
    return response.ok({ data: roles })
  }

  async store({ request, response }: HttpContext) {
    const { permissionIds, ...payload } = await request.validateUsing(createRoleValidator)
    const role = await Role.create(payload)

    if (permissionIds) {
      await role.related('permissions').sync(permissionIds)
    }

    await role.load('permissions')
    await role.load('users')

    return response.created({ data: role })
  }

  async show({ params, response }: HttpContext) {
    const role = await Role.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .preload('permissions')
      .preload('users')
      .firstOrFail()

    return response.ok({ data: role })
  }

  async update({ params, request, response }: HttpContext) {
    const role = await Role.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    const {
      permissionIds,
      params: paramsMeta,
      ...payload
    } = await request.validateUsing(updateRoleValidator, {
      meta: { params },
    })
    void paramsMeta

    role.merge(payload)
    await role.save()

    if (permissionIds) {
      await role.related('permissions').sync(permissionIds)
    }

    await role.load('permissions')
    await role.load('users')

    return response.ok({ data: role })
  }

  async destroy({ params, response }: HttpContext) {
    const role = await Role.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .preload('users')
      .firstOrFail()

    if (role.users.length > 0) {
      return response.conflict({
        message: 'Không thể xóa role đang được gán cho user. Hãy gỡ role khỏi user trước.',
      })
    }

    role.deletedAt = DateTime.utc()
    await role.save()

    return response.noContent()
  }
}
