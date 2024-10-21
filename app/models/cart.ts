import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

interface Product {
  id_prod: number;
  quantity: number;
}

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare products: Product[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}