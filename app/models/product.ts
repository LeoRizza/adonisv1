import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare photo: string

  @column()
  declare description: string

  @column()
  declare stock: number

  @column()
  declare price_mayorista: number

  @column()
  declare price_consumidor_final: number

  @column()
  declare price_responsable_inscripto: number

  @column()
  declare price_minorista_diferenciado: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
