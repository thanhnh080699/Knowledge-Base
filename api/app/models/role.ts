import { RoleSchema } from '#database/schema'
import { manyToMany, column } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Permission from './permission.js'

export default class Role extends RoleSchema {
  @column({ isPrimary: true })
  declare id: number

  @manyToMany(() => User, {
    pivotTable: 'role_users',
    onQuery: (query) => {
      query.whereNull('role_users.deleted_at').whereExists((sub) => {
        sub.from('users').whereColumn('users.id', 'role_users.user_id').whereNull('users.deleted_at')
      })
    },
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'permission_roles',
    onQuery: (query) => {
      query.whereNull('permission_roles.deleted_at').whereExists((sub) => {
        sub.from('permissions').whereColumn('permissions.id', 'permission_roles.permission_id').whereNull('permissions.deleted_at')
      })
    },
  })
  declare permissions: ManyToMany<typeof Permission>
}
