import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('contact_requests', (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('subject').nullable()
      table.text('message').notNullable()
      table.enum('status', ['PENDING', 'REPLIED', 'ARCHIVED']).defaultTo('PENDING')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('newsletters', (table) => {
      table.uuid('id').primary()
      table.string('email').notNullable().unique()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('newsletters')
    this.schema.dropTable('contact_requests')
  }
}
