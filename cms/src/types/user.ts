import type { EntityStatusFilter, Permission } from './acl'

export interface Role {
  id: string
  name: string
  slug: string
  description: string | null
  deletedAt?: string | null
  permissions?: Permission[]
}

export interface User {
  id: string
  fullName: string | null
  email: string
  status: 'active' | 'inactive'
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  roles: Role[]
}

export interface UserFilters {
  q?: string
  status?: EntityStatusFilter
  roleId?: string
}

export interface CreateUserPayload {
  fullName?: string
  email: string
  password: string
  roleIds?: string[]
}

export interface UpdateUserPayload {
  fullName?: string
  email?: string
  password?: string
  roleIds?: string[]
}

export interface UsersMeta {
  roles: Role[]
  trashCount: number
}
