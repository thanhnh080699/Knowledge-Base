export const ACL_MODULES = {
  USERS: {
    name: 'Users',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  ROLES: {
    name: 'Roles',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  PERMISSIONS: {
    name: 'Permissions',
    permissions: ['read'],
  },
  POSTS: {
    name: 'Posts',
    permissions: ['create', 'read', 'update', 'delete', 'publish'],
  },
  CATEGORIES: {
    name: 'Categories',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  TAGS: {
    name: 'Tags',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  PROJECTS: {
    name: 'Projects',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  SERVICES: {
    name: 'Services',
    permissions: ['create', 'read', 'update', 'delete'],
  },
  CONTACTS: {
    name: 'Contacts',
    permissions: ['read', 'delete'],
  },
  NEWSLETTERS: {
    name: 'Newsletters',
    permissions: ['read', 'delete'],
  },
} as const

export type AclModule = keyof typeof ACL_MODULES

export function getPermissionSlug(module: string, action: string) {
  return `${module.toLowerCase()}.${action.toLowerCase()}`
}

export function getPermissionName(module: string, action: string) {
  const actionName = action.charAt(0).toUpperCase() + action.slice(1)
  return `${actionName} ${module}`
}
