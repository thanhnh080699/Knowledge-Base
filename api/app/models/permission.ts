import { PermissionSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'

export default class Permission extends PermissionSchema {
  @manyToMany(() => Role, {
    pivotTable: 'permission_roles',
    onQuery: (query: any) => {
      query.whereNull('permission_roles.deleted_at').whereExists((sub: any) => {
        sub
          .from('roles')
          .whereColumn('roles.id', 'permission_roles.role_id')
          .whereNull('roles.deleted_at')
      })
    },
  })
  declare roles: ManyToMany<typeof Role>
}
