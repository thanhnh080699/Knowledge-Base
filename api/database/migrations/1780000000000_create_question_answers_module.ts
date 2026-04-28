import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'question_answers'

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
      table.string('question', 500).notNullable()
      table.text('answer').notNullable()
      table.integer('sort_order').unsigned().defaultTo(0)
      table.boolean('is_published').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['post_id', 'is_published', 'sort_order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
