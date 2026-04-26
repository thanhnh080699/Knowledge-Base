import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('categories', (table) => {
      table.string('meta_title').nullable().after('description')
      table.text('meta_description').nullable().after('meta_title')
    })

    this.schema.alterTable('tags', (table) => {
      table.text('description').nullable().after('slug')
      table.string('meta_title').nullable().after('description')
      table.text('meta_description').nullable().after('meta_title')
    })

    this.schema.alterTable('posts', (table) => {
      table.integer('wordpress_id').unsigned().nullable().unique().after('id')
      table.string('meta_title').nullable().after('excerpt')
      table.text('meta_description').nullable().after('meta_title')
      table.string('focus_keyword').nullable().after('meta_description')
      table.string('canonical_url').nullable().after('focus_keyword')
      table.integer('views').unsigned().notNullable().defaultTo(0).after('status')
      table.timestamp('published_at').nullable().after('series_id')
      table.timestamp('deleted_at').nullable().index().after('updated_at')
    })
  }

  async down() {
    this.schema.alterTable('posts', (table) => {
      table.dropColumn('deleted_at')
      table.dropColumn('published_at')
      table.dropColumn('views')
      table.dropColumn('canonical_url')
      table.dropColumn('focus_keyword')
      table.dropColumn('meta_description')
      table.dropColumn('meta_title')
      table.dropColumn('wordpress_id')
    })

    this.schema.alterTable('tags', (table) => {
      table.dropColumn('meta_description')
      table.dropColumn('meta_title')
      table.dropColumn('description')
    })

    this.schema.alterTable('categories', (table) => {
      table.dropColumn('meta_description')
      table.dropColumn('meta_title')
    })
  }
}
