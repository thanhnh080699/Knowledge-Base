import { PermissionSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'

export default class Permission extends PermissionSchema {
  @manyToMany(() => Role, {
    pivotTable: 'permission_roles',
    onQuery: (query) => {
      query.whereNull('permission_roles.deleted_at').whereExists((sub) => {
        sub
          .from('roles')
          .whereColumn('roles.id', 'permission_roles.role_id')
          .whereNull('roles.deleted_at')
      })
    },
  })
  declare roles: ManyToMany<typeof Role>
}
