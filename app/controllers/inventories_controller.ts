import type { HttpContext } from '@adonisjs/core/http'
import Inventory from '../models/inventory.js'
import AuditLog from '../models/audit_log.js'

export default class InventoriesController {
  async index({ response }: HttpContext) {
    const items = await Inventory.all()
    return response.json(items)
  }

  async show({ params, response }: HttpContext) {
    const item = await Inventory.findOrFail(params.id)
    return response.json(item)
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    const data = request.only(['name', 'description', 'price', 'stock'])
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
    const data = request.only(['name', 'description', 'price', 'stock'])
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
