import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('barcode').notNullable().unique()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('image').nullable()
      table.string('category').notNullable()
      table.decimal('price_final', 10, 2).notNullable()
      table.decimal('price_inscripto', 10, 2).notNullable()
      table.decimal('price_wholesale', 10, 2).notNullable()
      table.decimal('price_retail', 10, 2).notNullable()
      table.boolean('online').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
