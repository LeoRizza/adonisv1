import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class JwtMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const header = ctx.request.header('authorization')
    if (!header || !header.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ message: 'Missing token' })
    }

    try {
      const token = header.slice(7)
      const payload = jwt.verify(token, env.get('APP_KEY')) as any
      ctx.request.updateBody({ jwtPayload: payload })
      await next()
    } catch {
      return ctx.response.unauthorized({ message: 'Invalid token' })
    }
  }
}
