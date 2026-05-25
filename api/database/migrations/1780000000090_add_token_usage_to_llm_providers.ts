import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('llm_providers', (table) => {
      table.bigInteger('input_tokens').unsigned().notNullable().defaultTo(0).after('tasks')
      table.bigInteger('output_tokens').unsigned().notNullable().defaultTo(0).after('input_tokens')
      table.bigInteger('total_tokens').unsigned().notNullable().defaultTo(0).after('output_tokens')
    })
  }

  async down() {
    this.schema.alterTable('llm_providers', (table) => {
      table.dropColumn('total_tokens')
      table.dropColumn('output_tokens')
      table.dropColumn('input_tokens')
    })
  }
}
