import type { HttpContext } from '@adonisjs/core/http'
import Sale from '../models/sale.js'
import Cart from '../models/cart.js'
import User from '../models/user.js'
import Inventory from '../models/inventory.js'
import AuditLog from '../models/audit_log.js'

export default class SalesController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }

    const sales = await Sale.all()
    return response.json(sales)
  }

  async store({ auth, request, response }: HttpContext) {
    const currentUser = auth.user!

    let userId = currentUser.id
    let sellerId: number | null = null
    let saleType = 'online'
    let confirmed = false
    let items = request.input('items', [])
    let total = request.input('total', 0)

    if (currentUser.rol === 'user') {
      const cart = await Cart.findOrFail(currentUser.cart)
      items = cart.products || []
      await cart.merge({ products: [] }).save()
    } else {
      saleType = 'presencial'
      confirmed = true
      sellerId = currentUser.id
      userId = request.input('user_id', currentUser.id)
      const targetUser = await User.findOrFail(userId)
      if (['employee', 'admin'].includes(currentUser.rol) && targetUser.rol !== 'user') {
        return response.forbidden({ message: 'Acceso denegado' })
      }
    }

    const sale = await Sale.create({
      user_id: userId,
      seller_id: sellerId,
      sale_type: saleType,
      items,
      total,
      confirmed,
    })

    if (confirmed) {
      for (const item of items) {
        const prod = await Inventory.find(item.id_prod)
        if (prod) {
          prod.stock = prod.stock - item.quantity
          await prod.save()
        }
      }
    }

    await AuditLog.create({
      table_name: 'sales',
      record_id: sale.id,
      action: 'create',
      user_id: currentUser.id,
      data: sale,
    })

    return response.created(sale)
  }
}
