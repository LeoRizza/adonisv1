import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Inventory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare barcode: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare image: string | null

  @column()
  declare category: string | null

  @column()
  declare precio_consumidor_final: number

  @column()
  declare precio_responsable_inscripto: number

  @column()
  declare precio_mayorista: number

  @column()
  declare precio_minorista_diferenciado: number

  @column()
  declare online: boolean

  @column()
  declare stock: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
