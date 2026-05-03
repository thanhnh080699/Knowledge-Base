import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
        .after('slug')
      table.integer('sort_order').unsigned().defaultTo(0).after('icon')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['parent_id'])
      table.dropColumn('parent_id')
      table.dropColumn('sort_order')
    })
  }
}
