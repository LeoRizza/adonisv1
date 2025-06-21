import type { HttpContext } from '@adonisjs/core/http'
import Product from '../models/product.js'

export default class ProductsController {
  async index({ auth, response }: HttpContext) {
    const products = await Product.all()
    if (auth.user && auth.user.rol !== 'user') {
      return response.json(products)
    }
    // hide other prices for normal users
    const serialized = products.map((p) => {
      return {
        id: p.id,
        name: p.name,
        code: p.code,
        photo: p.photo,
        description: p.description,
        stock: p.stock,
        price_consumidor_final: p.price_consumidor_final,
      }
    })
    return response.json(serialized)
  }

  async show({ params, auth, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    if (auth.user && auth.user.rol !== 'user') {
      return response.json(product)
    }
    const serialized = {
      id: product.id,
      name: product.name,
      code: product.code,
      photo: product.photo,
      description: product.description,
      stock: product.stock,
      price_consumidor_final: product.price_consumidor_final,
    }
    return response.json(serialized)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'name',
      'code',
      'photo',
      'description',
      'stock',
      'price_mayorista',
      'price_consumidor_final',
      'price_responsable_inscripto',
      'price_minorista_diferenciado',
    ])
    const product = await Product.create(data)
    return response.created(product)
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = request.only([
      'name',
      'code',
      'photo',
      'description',
      'stock',
      'price_mayorista',
      'price_consumidor_final',
      'price_responsable_inscripto',
      'price_minorista_diferenciado',
    ])
    product.merge(data)
    await product.save()
    return response.json(product)
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.json({})
  }
}
