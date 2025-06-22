import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare seller_id: number | null

  @column()
  declare sale_type: string

  @column()
  declare items: unknown[]

  @column()
  declare total: number

  @column()
  declare confirmed: boolean

  @column()
  declare pdf_path: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
