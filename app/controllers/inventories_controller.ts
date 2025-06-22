import type { HttpContext } from '@adonisjs/core/http'
import Inventory from '../models/inventory.js'
import AuditLog from '../models/audit_log.js'

export default class InventoriesController {
  async index({ auth, response }: HttpContext) {
    const currentUser = auth.user
    const query = Inventory.query()
    if (!currentUser || currentUser.rol === 'user') {
      query.where('online', true)
    }
    const items = await query
    return response.json(items)
  }

  async show({ params, auth, response }: HttpContext) {
    const currentUser = auth.user
    const item = await Inventory.findOrFail(params.id)
    if ((!currentUser || currentUser.rol === 'user') && !item.online) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    return response.json(item)
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    const data = request.only([
      'barcode',
      'name',
      'description',
      'image',
      'category',
      'precio_consumidor_final',
      'precio_responsable_inscripto',
      'precio_mayorista',
      'precio_minorista_diferenciado',
      'online',
      'stock',
    ])
    const item = await Inventory.create(data)
    await AuditLog.create({
      table_name: 'inventories',
      record_id: item.id,
      action: 'create',
      user_id: user.id,
      data: item,
    })
    return response.created(item)
  }

  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    const item = await Inventory.findOrFail(params.id)
    const data = request.only([
      'barcode',
      'name',
      'description',
      'image',
      'category',
      'precio_consumidor_final',
      'precio_responsable_inscripto',
      'precio_mayorista',
      'precio_minorista_diferenciado',
      'online',
      'stock',
    ])
    item.merge(data)
    await item.save()
    await AuditLog.create({
      table_name: 'inventories',
      record_id: item.id,
      action: 'update',
      user_id: user.id,
      data: item,
    })
    return response.json(item)
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    const item = await Inventory.findOrFail(params.id)
    await item.delete()
    await AuditLog.create({
      table_name: 'inventories',
      record_id: item.id,
      action: 'delete',
      user_id: user.id,
      data: item,
    })
    return response.noContent()
  }
}
