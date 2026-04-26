import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('categories', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.string('icon').nullable()
      table.string('color').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('tags', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('series', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('posts', (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('content').notNullable()
      table.text('excerpt').nullable()
      table.string('cover_image').nullable()
      table.enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']).defaultTo('DRAFT')
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
      table.integer('series_id').unsigned().references('id').inTable('series').onDelete('SET NULL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable('post_tag', (table) => {
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE')
      table.unique(['post_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable('post_tag')
    this.schema.dropTable('posts')
    this.schema.dropTable('series')
    this.schema.dropTable('tags')
    this.schema.dropTable('categories')
  }
}
