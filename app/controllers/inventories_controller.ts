import type { HttpContext } from '@adonisjs/core/http'
import Inventory from '../models/inventory.js'

export default class InventoriesController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    const items = await Inventory.all()
    return response.json(items)
  }

  async show({ params, auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
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
    return response.json(item)
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!
    if (!['admin', 'god'].includes(user.rol)) {
      return response.forbidden({ message: 'Acceso denegado' })
    }
    const item = await Inventory.findOrFail(params.id)
    await item.delete()
    return response.noContent()
  }
}
