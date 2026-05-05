import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tools'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.string('category').notNullable()
      table.string('icon').nullable()
      table.string('url_path').notNullable()
      table.boolean('featured').defaultTo(false)
      table.enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']).defaultTo('PUBLISHED')
      table.integer('sort_order').defaultTo(0)
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
