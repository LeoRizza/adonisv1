import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, roles: string[]) {
    await auth.authenticate()
    if (!roles.includes(auth.user!.rol)) {
      return response.forbidden({ message: 'Access denied' })
    }
    return next()
  }
}
