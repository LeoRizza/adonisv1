import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('table_name').notNullable()
      table.integer('record_id').notNullable()
      table.string('action').notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('SET NULL')
      table.jsonb('data')
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
