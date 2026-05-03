import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('content').nullable().after('description')
      table.string('status').notNullable().defaultTo('PUBLISHED').after('featured')
      table.index(['status'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['status'])
      table.dropColumn('status')
      table.dropColumn('content')
    })
  }
}
