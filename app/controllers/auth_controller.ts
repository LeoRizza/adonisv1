import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.query().where('email', email).first()
    if (!user) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const valid = await hash.verify(user.password, password)
    if (!valid) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ uid: user.id, role: user.rol }, env.get('APP_KEY'), {
      expiresIn: '1h',
    })

    return response.ok({ token })
  }
}
