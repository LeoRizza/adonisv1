import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('barcode').notNullable().unique()
      table.string('name').notNullable()
      table.text('description')
      table.string('image')
      table.string('category')
      table.decimal('precio_consumidor_final', 10, 2).notNullable().defaultTo(0)
      table.decimal('precio_responsable_inscripto', 10, 2).notNullable().defaultTo(0)
      table.decimal('precio_mayorista', 10, 2).notNullable().defaultTo(0)
      table.decimal('precio_minorista_diferenciado', 10, 2).notNullable().defaultTo(0)
      table.boolean('online').defaultTo(false)
      table.integer('stock').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
