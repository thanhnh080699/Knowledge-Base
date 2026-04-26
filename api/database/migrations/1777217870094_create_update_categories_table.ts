import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('color')
      table.string('image').nullable().after('slug')
      table.text('description', 'longtext').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('color').nullable().after('icon')
      table.dropColumn('image')
      table.text('description').nullable().alter()
    })
  }
}