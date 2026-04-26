export const ACL_MODULES = {
  USERS: {
    name: 'Users',
    permissions: ['create', 'read', 'update', 'delete', 'manage'],
  },
  ROLES: {
    name: 'Roles',
    permissions: ['create', 'read', 'update', 'delete', 'manage'],
  },
  PERMISSIONS: {
    name: 'Permissions',
    permissions: ['read', 'manage'],
  },
  POSTS: {
    name: 'Posts',
    permissions: ['create', 'read', 'update', 'delete', 'publish', 'manage'],
  },
  CATEGORIES: {
    name: 'Categories',
    permissions: ['create', 'read', 'update', 'delete', 'manage'],
  },
  TAGS: {
    name: 'Tags',
    permissions: ['create', 'read', 'update', 'delete', 'manage'],
  },
  PROJECTS: {
    name: 'Projects',
    permissions: ['create', 'read', 'update', 'delete', 'manage'],
  },
  SERVICES: {
    name: 'Services',
    permissions: ['create', 'read', 'update', 'delete', 'manage'],
  },
  CONTACTS: {
    name: 'Contacts',
    permissions: ['read', 'delete', 'manage'],
  },
  NEWSLETTERS: {
    name: 'Newsletters',
    permissions: ['read', 'delete', 'manage'],
  },
  SETTINGS: {
    name: 'Settings',
    permissions: ['manage'],
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
