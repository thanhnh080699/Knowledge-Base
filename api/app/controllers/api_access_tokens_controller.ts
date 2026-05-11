import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import ApiAccessToken from '#models/api_access_token'
import Permission from '#models/permission'
import {
  createApiAccessTokenValidator,
  EXPIRATION_OPTIONS,
  updateApiAccessTokenValidator,
} from '#validators/api_access_token'

type ExpirationOption = (typeof EXPIRATION_OPTIONS)[number]

function resolveExpiration(option: ExpirationOption) {
  switch (option) {
    case '1_week':
      return DateTime.utc().plus({ weeks: 1 })
    case '1_month':
      return DateTime.utc().plus({ months: 1 })
    case '1_year':
      return DateTime.utc().plus({ years: 1 })
    case 'no_expire':
      return null
  }
}

async function ensurePermissionsExist(permissions: string[]) {
  const existing = await Permission.query()
    .whereIn('slug', permissions)
    .whereNull('deleted_at')
  const existingSlugs = new Set(existing.map((permission) => permission.slug))
  const missing = permissions.filter((permission) => !existingSlugs.has(permission))

  if (missing.length > 0) {
    throw new Error(`Unknown permissions: ${missing.join(', ')}`)
  }
}

export default class ApiAccessTokensController {
  /**
   * @index
   * @tag API TOKENS
   * @description List API access tokens for automation and content integrations
   * @responseBody 200 - { data: [{ id, name, permissions, expiresAt, lastUsedAt, createdAt }] }
   */
  async index({ response }: HttpContext) {
    const tokens = await ApiAccessToken.query()
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc')

    return response.ok({ data: tokens })
  }

  /**
   * @store
   * @tag API TOKENS
   * @description Create API access token. Plain token is returned only once.
   * @requestBody { name: "Marketing automation", expiresIn: "1_month", permissions: ["posts.read"] }
   * @responseBody 201 - { data: { token: "thn_...", item: <ApiAccessToken> } }
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createApiAccessTokenValidator)
    await ensurePermissionsExist(payload.permissions)

    const token = await ApiAccessToken.create({
      name: payload.name,
      permissions: payload.permissions,
      expiresAt: resolveExpiration(payload.expiresIn),
    })

    return response.created({
      data: {
        token: token.plainToken,
        item: token,
      },
    })
  }

  /**
   * @update
   * @tag API TOKENS
   * @description Update API access token metadata, expiration and permissions
   * @paramPath id - Token ID
   * @requestBody { name: "Marketing automation", expiresIn: "1_year", permissions: ["posts.read"] }
   * @responseBody 200 - { data: <ApiAccessToken> }
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateApiAccessTokenValidator, {
      meta: { params },
    })

    if (payload.permissions) {
      await ensurePermissionsExist(payload.permissions)
    }

    const token = await ApiAccessToken.query()
      .where('id', payload.params.id)
      .whereNull('deleted_at')
      .firstOrFail()

    token.merge({
      name: payload.name ?? token.name,
      permissions: payload.permissions ?? token.permissions,
      expiresAt: payload.expiresIn ? resolveExpiration(payload.expiresIn) : token.expiresAt,
    })
    await token.save()

    return response.ok({ data: token })
  }

  /**
   * @destroy
   * @tag API TOKENS
   * @description Soft delete an API access token
   * @paramPath id - Token ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const token = await ApiAccessToken.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()

    token.deletedAt = DateTime.utc()
    await token.save()

    return response.noContent()
  }
}
