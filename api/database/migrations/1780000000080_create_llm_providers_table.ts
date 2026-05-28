import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('llm_providers', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.enum('driver', ['openai', 'gemini', 'nvidia', 'openrouter', 'custom']).notNullable()
      table.string('model_name', 255).notNullable()
      table.text('api_key').nullable()
      table.string('base_url', 500).nullable()
      table.text('tasks').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true).index()
      table.integer('sort_order').unsigned().notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().index()
    })
  }

  async down() {
    this.schema.dropTable('llm_providers')
  }
}
