import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AclMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { permission?: string | string[]; role?: string } = {}) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'User not authenticated' })
    }

    if (options.role) {
      const hasRole = await user.hasRole(options.role)
      if (!hasRole) {
        return ctx.response.forbidden({ message: 'Insufficient role' })
      }
    }

    if (options.permission) {
      const hasPermission = await user.hasAnyPermission(
        Array.isArray(options.permission) ? options.permission : [options.permission]
      )
      if (!hasPermission) {
        return ctx.response.forbidden({ message: 'Insufficient permissions' })
      }
    }

    return await next()
  }
}