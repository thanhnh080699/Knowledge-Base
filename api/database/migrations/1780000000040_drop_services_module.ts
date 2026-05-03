import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    const hasTable = await this.schema.hasTable(this.tableName)
    if (hasTable) {
      this.schema.dropTable(this.tableName)
    }
  }

  async down() {
    const hasTable = await this.schema.hasTable(this.tableName)
    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('slug').notNullable().unique()
        table.text('description').nullable()
        table.json('features').nullable()
        table.string('price_range').nullable()
        table.string('category').nullable()
        table.boolean('featured').defaultTo(false)
        table.timestamp('created_at')
        table.timestamp('updated_at')
      })
    }
  }
}
