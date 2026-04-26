import type { EntityStatusFilter, Permission } from './acl'

export interface Role {
  id: number
  name: string
  slug: string
  description: string | null
  deletedAt?: string | null
  permissions?: Permission[]
}

export interface User {
  id: number
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
  roleId?: number
}

export interface CreateUserPayload {
  fullName?: string
  email: string
  password: string
  roleIds?: number[]
}

export interface UpdateUserPayload {
  fullName?: string
  email?: string
  password?: string
  roleIds?: number[]
}

export interface UsersMeta {
  roles: Role[]
  trashCount: number
}
