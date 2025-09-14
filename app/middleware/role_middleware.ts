import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles?: string[] } = {}) {
    const payload = ctx.request.body().jwtPayload as any
    const roles = options.roles || []
    if (!payload || !roles.includes(payload.role)) {
      return ctx.response.forbidden({ message: 'Access denied' })
    }
    await next()
  }
}
