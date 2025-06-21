import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('code').notNullable()
      table.string('photo').nullable()
      table.text('description').nullable()
      table.integer('stock').defaultTo(0)
      table.decimal('price_mayorista', 10, 2).notNullable()
      table.decimal('price_consumidor_final', 10, 2).notNullable()
      table.decimal('price_responsable_inscripto', 10, 2).notNullable()
      table.decimal('price_minorista_diferenciado', 10, 2).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
