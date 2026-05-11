import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'
import ApiAccessToken from '#models/api_access_token'

export default class ApiTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { permission?: string } = {}) {
    const authorization = ctx.request.header('authorization')
    const bearerToken = authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : undefined
    const plainToken =
      ctx.request.header('x-api-token') ??
      ctx.request.header('x-access-token') ??
      bearerToken

    if (!plainToken) {
      return ctx.response.unauthorized({ message: 'API token is required' })
    }

    const token = await ApiAccessToken.query()
      .where('token_hash', ApiAccessToken.hashToken(plainToken))
      .whereNull('deleted_at')
      .first()

    if (!token || token.isExpired) {
      return ctx.response.unauthorized({ message: 'Invalid or expired API token' })
    }

    if (options.permission && !token.hasPermission(options.permission)) {
      return ctx.response.forbidden({ message: 'Insufficient token permissions' })
    }

    token.lastUsedAt = DateTime.utc()
    await token.save()

    return next()
  }
}
