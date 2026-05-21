import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('posts', (table) => {
      table.dropColumn('wordpress_id')
    })
  }

  async down() {
    this.schema.alterTable('posts', (table) => {
      table.integer('wordpress_id').unsigned().nullable().unique().after('id')
    })
  }
}
