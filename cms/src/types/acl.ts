import type { Role } from './user'

export type EntityStatusFilter = 'active' | 'deleted' | 'all'

export interface Permission {
  id: number
  name: string
  slug: string
  module: string
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  roles?: Role[]
}

export interface AclRole {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  permissions?: Permission[]
  users?: Array<{ id: number; fullName: string | null; email: string }>
}

export interface RoleFilters {
  q?: string
  status?: EntityStatusFilter
  permissionId?: number
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
  permissionIds?: number[]
}

export interface UpdateRolePayload {
  name?: string
  slug?: string
  description?: string | null
  permissionIds?: number[]
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
