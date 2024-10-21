import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import hash from '@adonisjs/core/services/hash'
import Cart from '../models/cart.js'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const users = await User.all()
      return response.json(users)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Error obteniendo usuarios' })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    
    try {
      const data = request.only(['first_name', 'last_name', 'email', 'password', 'rol', 'cart'])

      const existe = await User.query().where('email', data.email).first()

      if (!existe) {
        const newCart = await Cart.create({})
        data.cart = newCart.id

        const hashedPassword = await hash.make(data.password)
        data.password = hashedPassword

        const user = await User.create(data)
        const token = await User.accessTokens.create(user)

        return response.created({
          user,
          token: {
            type: 'bearer',
            value: token.value!.release(),
          }
        })
      }
      return response.status(409).json({ message: 'El correo electrónico ya está en uso' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Error al crear el usuario' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    try {
      const userData = await User.findOrFail(params.id)
      return response.json(userData)
    } catch (error) {
      console.error(error)
      return response.status(404).json({ message: 'Usuario no encontrado' })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const userData = await User.findOrFail(params.id)
      const { first_name, last_name, email, password } = request.only([
        'first_name',
        'last_name',
        'email',
        'password',
      ])

      userData.merge({
        first_name,
        last_name,
        email,
        password,
      })

      await userData.save()

      return response.json(userData)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Error al actualizar el usuario' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const userData = await User.findOrFail(params.id)
      await userData.delete()
      return response.status(200).send("Usuario eliminado")
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Error al eliminar el usuario' })
    }
  }
}