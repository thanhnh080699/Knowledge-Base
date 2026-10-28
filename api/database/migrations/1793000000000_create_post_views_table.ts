import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('post_views', (table) => {
      table.increments('id')
      table
        .integer('post_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
      table.string('visitor_key', 64).notNullable()
      table.string('ip', 45).nullable()
      table.string('country', 2).nullable()
      table.string('region', 100).nullable()
      table.string('city', 150).nullable()
      table.string('browser', 50).notNullable()
      table.string('os', 50).notNullable()
      table.string('device', 20).notNullable()
      table.string('referrer', 255).nullable()
      table.timestamp('created_at').notNullable()
      table.unique(['post_id', 'visitor_key'])
      table.index(['post_id', 'created_at', 'id'])
    })
  }

  async down() {
    this.schema.dropTable('post_views')
  }
}
