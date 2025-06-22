import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AuditLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare table_name: string

  @column()
  declare record_id: number

  @column()
  declare action: string

  @column()
  declare user_id: number | null

  @column()
  declare data: unknown

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
