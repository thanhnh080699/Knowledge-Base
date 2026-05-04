import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { createUserValidator, updateUserValidator, changePasswordValidator } from '#validators/user'
import { DateTime } from 'luxon'

function applyDeletedFilter(query: ReturnType<typeof User.query>, status: string) {
  if (status === 'deleted') {
    query.whereNotNull('deleted_at')
    return
  }

  if (status === 'active') {
    query.whereNull('deleted_at').where('status', 'active')
    return
  }

  if (status !== 'all') {
    query.whereNull('deleted_at')
  }
}

export default class UsersController {
  /**
   * @meta
   * @tag USERS
   * @description Return ACL metadata used by the CMS users module
   * @responseBody 200 - { data: { roles: <Role[]> } }
   */
  async meta({ response }: HttpContext) {
    const roles = await Role.query()
      .whereNull('deleted_at')
      .preload('permissions')
      .orderBy('name', 'asc')

    const trashCountResult = await User.query().whereNotNull('deleted_at').count('* as total')
    const trashCount = Number(trashCountResult[0].$extras.total)

    return response.ok({ data: { roles, trashCount } })
  }

  /**
   * @index
   * @tag USERS
   * @description Display a list of users
   * @responseBody 200 - { data: <User[]> }
   */
  async index({ request, response }: HttpContext) {
    const q = request.input('q', '').trim().toLowerCase()
    const status = request.input('status', 'active')
    const roleId = request.input('roleId')

    const query = User.query().preload('roles').orderBy('created_at', 'desc')

    applyDeletedFilter(query, status)

    if (q) {
      query.where((builder) => {
        builder
          .whereRaw('LOWER(email) LIKE ?', [`%${q}%`])
          .orWhereRaw("LOWER(COALESCE(full_name, '')) LIKE ?", [`%${q}%`])
      })
    }

    if (roleId) {
      query.whereHas('roles', (roleQuery) => {
        roleQuery.where('roles.id', roleId)
      })
    }

    const users = await query
    return response.ok({ data: users })
  }

  /**
   * @store
   * @tag USERS
   * @description Create a new user
   * @requestBody <User>
   * @responseBody 201 - { data: <User> }
   */
  async store({ request, response }: HttpContext) {
    const { roleIds, password, ...payload } = await request.validateUsing(createUserValidator)

    const user = new User()
    user.fill(payload)
    user.password = password
    await user.save()

    if (roleIds) {
      await user.related('roles').sync(roleIds)
    }

    await user.load('roles')
    return response.created({ data: user })
  }

  /**
   * @show
   * @tag USERS
   * @description Show an individual user
   * @paramPath id - The user ID
   * @responseBody 200 - { data: <User> }
   */
  async show({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .preload('roles')
      .firstOrFail()
    return response.ok({ data: user })
  }

  /**
   * @update
   * @tag USERS
   * @description Update an existing user
   * @paramPath id - The user ID
   * @requestBody <User>
   * @responseBody 200 - { data: <User> }
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    const { roleIds, password, ...payload } = await request.validateUsing(updateUserValidator, {
      meta: { params },
    })

    user.merge(payload)
    if (password) {
      user.password = password
    }
    await user.save()

    if (roleIds) {
      await user.related('roles').sync(roleIds)
    }

    await user.load('roles')
    return response.ok({ data: user })
  }

  /**
   * @destroy
   * @tag USERS
   * @description Delete a user
   * @paramPath id - The user ID
   * @responseBody 204 - No content
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = await User.query().where('id', params.id).whereNull('deleted_at').firstOrFail()

    if (auth.user?.id === user.id) {
      return response.conflict({ message: 'Không thể xóa chính tài khoản đang đăng nhập.' })
    }

    user.deletedAt = DateTime.utc()
    user.status = 'inactive'
    await user.save()
    return response.noContent()
  }

  /**
   * @forceDestroy
   * @tag USERS
   * @description Permanently delete a user from the database
   * @paramPath id - The user ID
   * @responseBody 204 - No content
   */
  async forceDestroy({ auth, params, response }: HttpContext) {
    const user = await User.query().where('id', params.id).whereNotNull('deleted_at').firstOrFail()

    if (auth.user?.id === user.id) {
      return response.conflict({ message: 'Không thể xóa chính tài khoản đang đăng nhập.' })
    }

    await user.delete()
    return response.noContent()
  }

  /**
   * @changePassword
   * @tag USERS
   * @description Change user password and invalidate all sessions
   * @paramPath id - The user ID
   * @requestBody { password: <string> }
   * @responseBody 204 - No content
   */
  async changePassword({ params, request, response }: HttpContext) {
    const user = await User.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    const { password } = await request.validateUsing(changePasswordValidator)

    user.password = password
    await user.save()

    // Invalidate all sessions
    const tokens = await User.accessTokens.all(user)
    for (const token of tokens) {
      await User.accessTokens.delete(user, token.identifier)
    }

    return response.noContent()
  }
}
