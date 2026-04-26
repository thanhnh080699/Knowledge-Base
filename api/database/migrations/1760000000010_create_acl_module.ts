import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('roles', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable().unique()
      table.string('slug', 255).notNullable().unique()
      table.string('description', 255).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().index()
    })

    this.schema.createTable('permissions', (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable().unique()
      table.string('slug', 255).notNullable().unique()
      table.string('module', 255).notNullable()
      table.string('description', 255).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().index()
    })

    this.schema.createTable('role_users', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.unique(['user_id', 'role_id'])
      table.timestamp('deleted_at').nullable().index()
    })

    this.schema.createTable('permission_roles', (table) => {
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')
      table.unique(['role_id', 'permission_id'])
      table.timestamp('deleted_at').nullable().index()
    })
  }

  async down() {
    this.schema.dropTable('permission_roles')
    this.schema.dropTable('role_users')
    this.schema.dropTable('permissions')
    this.schema.dropTable('roles')
  }
}
