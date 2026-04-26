import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('setting_group', 100).notNullable()
      table.string('setting_key', 150).notNullable()
      table.json('setting_value').nullable()
      table
        .enum('type', ['string', 'text', 'email', 'url', 'boolean', 'number', 'select', 'json'])
        .defaultTo('string')
        .notNullable()
      table.string('label', 255).notNullable()
      table.text('description').nullable()
      table.integer('sort_order').unsigned().defaultTo(0).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['setting_group', 'setting_key'])
      table.index(['setting_group', 'sort_order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
