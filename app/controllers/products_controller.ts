import type { HttpContext } from '@adonisjs/core/http'
import Product from '../models/product.js'

export default class ProductsController {
  async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.json(products)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'barcode',
      'name',
      'description',
      'image',
      'category',
      'price_final',
      'price_inscripto',
      'price_wholesale',
      'price_retail',
      'online',
    ])
    const product = await Product.create(data)
    return response.created(product)
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    return response.json(product)
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = request.only([
      'barcode',
      'name',
      'description',
      'image',
      'category',
      'price_final',
      'price_inscripto',
      'price_wholesale',
      'price_retail',
      'online',
    ])
    product.merge(data)
    await product.save()
    return response.json(product)
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.noContent()
  }
}
