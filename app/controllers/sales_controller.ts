import type { HttpContext } from '@adonisjs/core/http'
import Sale from '../models/sale.js'

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
    const user = auth.user!
    const data = request.only(['items', 'total'])

    const sale = await Sale.create({
      user_id: user.id,
      items: data.items || [],
      total: data.total || 0,
    })

    return response.created(sale)
  }
}
