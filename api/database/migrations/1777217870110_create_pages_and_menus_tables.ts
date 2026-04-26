import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('pages', (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('content').notNullable()
      table.text('excerpt').nullable()
      table.string('template').nullable()
      table.string('cover_image').nullable()
      table.string('meta_title').nullable()
      table.text('meta_description').nullable()
      table.string('focus_keyword').nullable()
      table.string('canonical_url').nullable()
      table.enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']).notNullable().defaultTo('DRAFT')
      table.boolean('is_homepage').notNullable().defaultTo(false).index()
      table.timestamp('published_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().index()
    })

    this.schema.createTable('menus', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.string('location').nullable().index()
      table.boolean('is_default').notNullable().defaultTo(false).index()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().index()
    })

    this.schema.createTable('menu_items', (table) => {
      table.increments('id').primary()
      table.integer('menu_id').unsigned().notNullable().references('id').inTable('menus').onDelete('CASCADE')
      table.integer('parent_id').unsigned().nullable().references('id').inTable('menu_items').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('url').nullable()
      table.enum('type', ['CUSTOM', 'PAGE', 'POST', 'CATEGORY', 'TAG']).notNullable().defaultTo('CUSTOM')
      table.integer('reference_id').unsigned().nullable()
      table.enum('target', ['_self', '_blank']).notNullable().defaultTo('_self')
      table.string('css_class').nullable()
      table.string('rel').nullable()
      table.integer('sort_order').unsigned().notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['menu_id', 'parent_id', 'sort_order'])
    })
  }

  async down() {
    this.schema.dropTable('menu_items')
    this.schema.dropTable('menus')
    this.schema.dropTable('pages')
  }
}
