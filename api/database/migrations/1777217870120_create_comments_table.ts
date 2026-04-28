import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('post_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('comments')
        .onDelete('SET NULL')
      table.string('author_name').notNullable()
      table.string('author_email').notNullable()
      table.string('author_website').nullable()
      table.text('content').notNullable()
      table.enum('status', ['PENDING', 'APPROVED', 'SPAM']).notNullable().defaultTo('PENDING')
      table.string('ip_address', 64).nullable()
      table.text('user_agent').nullable()
      table.timestamp('approved_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()

      table.index(['post_id', 'status'])
      table.index(['parent_id'])
      table.index(['status'])
      table.index(['deleted_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
