import type { Role } from './user'

export type EntityStatusFilter = 'active' | 'deleted' | 'all'

export interface Permission {
  id: string
  name: string
  slug: string
  module: string
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  roles?: Role[]
}

export interface AclRole {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  permissions?: Permission[]
  users?: Array<{ id: string; fullName: string | null; email: string }>
}

export interface RoleFilters {
  q?: string
  status?: EntityStatusFilter
  permissionId?: string
}

export interface PermissionFilters {
  q?: string
  status?: EntityStatusFilter
  module?: string
}

export interface RoleMeta {
  permissions: Permission[]
}

export interface CreateRolePayload {
  name: string
  slug: string
  description?: string
  permissionIds?: string[]
}

export interface UpdateRolePayload {
  name?: string
  slug?: string
  description?: string | null
  permissionIds?: string[]
}

export interface CreatePermissionPayload {
  name: string
  slug: string
  module: string
}

export interface UpdatePermissionPayload {
  name?: string
  slug?: string
  module?: string
}
