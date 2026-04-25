import type { HttpContext } from '@adonisjs/core/http'
import Permission from '#models/permission'
import { DateTime } from 'luxon'
import { createPermissionValidator, updatePermissionValidator } from '#validators/permission'

function applyDeletedFilter(query: ReturnType<typeof Permission.query>, status: string) {
  if (status === 'deleted') {
    query.whereNotNull('deleted_at')
    return
  }

  if (status !== 'all') {
    query.whereNull('deleted_at')
  }
}

export default class PermissionsController {
  async index({ request, response }: HttpContext) {
    const q = request.input('q', '').trim().toLowerCase()
    const status = request.input('status', 'active')
    const module = request.input('module')

    const query = Permission.query()
      .preload('roles')
      .orderBy('module', 'asc')
      .orderBy('name', 'asc')

    applyDeletedFilter(query, status)

    if (q) {
      query.where((builder) => {
        builder
          .whereRaw('LOWER(name) LIKE ?', [`%${q}%`])
          .orWhereRaw('LOWER(slug) LIKE ?', [`%${q}%`])
          .orWhereRaw('LOWER(module) LIKE ?', [`%${q}%`])
      })
    }

    if (module) {
      query.whereRaw('LOWER(module) = ?', [String(module).toLowerCase()])
    }

    const permissions = await query
    return response.ok({ data: permissions })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createPermissionValidator)
    const permission = await Permission.create(payload)
    await permission.load('roles')
    return response.created({ data: permission })
  }

  async show({ params, response }: HttpContext) {
    const permission = await Permission.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .preload('roles')
      .firstOrFail()

    return response.ok({ data: permission })
  }

  async update({ params, request, response }: HttpContext) {
    const permission = await Permission.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()
    const { params: paramsMeta, ...payload } = await request.validateUsing(
      updatePermissionValidator,
      {
        meta: { params },
      }
    )
    void paramsMeta

    permission.merge(payload)
    await permission.save()
    await permission.load('roles')

    return response.ok({ data: permission })
  }

  async destroy({ params, response }: HttpContext) {
    const permission = await Permission.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .preload('roles')
      .firstOrFail()

    if (permission.roles.length > 0) {
      return response.conflict({
        message:
          'Không thể xóa permission đang được gán cho role. Hãy gỡ permission khỏi role trước.',
      })
    }

    permission.deletedAt = DateTime.utc()
    await permission.save()

    return response.noContent()
  }
}
