import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import hash from '@adonisjs/core/services/hash'
import Cart from '../models/cart.js'
import AuditLog from '../models/audit_log.js'

export default class UsersController {
  async index({ auth, response }: HttpContext) {
    const currentUser = auth.user!
    if (currentUser.rol === 'user') {
      return response.forbidden({ message: 'Acceso denegado' })
    }

    if (['employee', 'admin'].includes(currentUser.rol)) {
      const users = await User.query().where('rol', 'user')
      return response.json(users)
    }

    const users = await User.all()
    return response.json(users)
  }

  async store({ auth, request, response }: HttpContext) {
    const data = request.only(['first_name', 'last_name', 'email', 'password', 'rol'])
    const existe = await User.query().where('email', data.email).first()
    if (existe) {
      return response.status(409).json({ message: 'El correo electrónico ya está en uso' })
    }

    let role = data.rol || 'user'
    const currentUser = auth.user
    if (!currentUser) {
      role = 'user'
    } else if (['employee', 'admin'].includes(currentUser.rol)) {
      role = 'user'
    } else if (currentUser.rol !== 'god') {
      return response.forbidden({ message: 'Acceso denegado' })
    }

    const newCart = await Cart.create({})
    const hashedPassword = await hash.make(data.password)
    const user = await User.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
      rol: role,
      cart: String(newCart.id),
    })

    await AuditLog.create({
      table_name: 'users',
      record_id: user.id,
      action: 'create',
      user_id: currentUser ? currentUser.id : user.id,
      data: user,
    })

    const token = await User.accessTokens.create(user)
    return response.created({
      user,
      token: { type: 'bearer', value: token.value!.release() },
    })
  }

  async show({ params, auth, response }: HttpContext) {
    const currentUser = auth.user!
    const userData = await User.findOrFail(params.id)
    if (currentUser.rol === 'user' && currentUser.id !== userData.id) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    if (['employee', 'admin'].includes(currentUser.rol) && userData.rol !== 'user') {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    return response.json(userData)
  }

  async update({ params, request, auth, response }: HttpContext) {
    const currentUser = auth.user!
    const userData = await User.findOrFail(params.id)
    if (currentUser.rol === 'user' && currentUser.id !== userData.id) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    if (['employee', 'admin'].includes(currentUser.rol) && userData.rol !== 'user') {
      return response.forbidden({ message: 'Acceso denegado' })
    }

    const { first_name, last_name, email, password, rol } = request.only([
      'first_name',
      'last_name',
      'email',
      'password',
      'rol',
    ])

    userData.merge({ first_name, last_name, email })
    if (password) {
      userData.password = await hash.make(password)
    }
    if (rol && currentUser.rol === 'god') {
      userData.rol = rol
    }
    await userData.save()

    await AuditLog.create({
      table_name: 'users',
      record_id: userData.id,
      action: 'update',
      user_id: currentUser.id,
      data: userData,
    })

    return response.json(userData)
  }

  async destroy({ params, auth, response }: HttpContext) {
    const currentUser = auth.user!
    const userData = await User.findOrFail(params.id)
    if (currentUser.rol === 'user') {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    if (['employee', 'admin'].includes(currentUser.rol) && userData.rol !== 'user') {
      return response.forbidden({ message: 'Acceso denegado' })
    }

    await userData.delete()
    await AuditLog.create({
      table_name: 'users',
      record_id: userData.id,
      action: 'delete',
      user_id: currentUser.id,
      data: userData,
    })

    return response.status(200).send('Usuario eliminado')
  }
}
