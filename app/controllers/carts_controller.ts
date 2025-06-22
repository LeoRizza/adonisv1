import type { HttpContext } from '@adonisjs/core/http'
import Cart from '../models/cart.js'
import AuditLog from '../models/audit_log.js'

export default class CartsController {
  async show({ auth, response }: HttpContext) {
    const user = auth.user!
    const cart = await Cart.findOrFail(user.cart)
    return response.json(cart)
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const cart = await Cart.findOrFail(user.cart)
    cart.products = request.input('products', cart.products)
    await cart.save()
    await AuditLog.create({
      table_name: 'carts',
      record_id: cart.id,
      action: 'update',
      user_id: user.id,
      data: cart,
    })
    return response.json(cart)
  }
}
