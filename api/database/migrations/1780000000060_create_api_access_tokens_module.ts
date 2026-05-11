import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('api_access_tokens', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.string('token_hash', 255).notNullable().unique()
      table.text('permissions').notNullable()
      table.timestamp('expires_at').nullable().index()
      table.timestamp('last_used_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().index()
    })
  }

  async down() {
    this.schema.dropTable('api_access_tokens')
  }
}
