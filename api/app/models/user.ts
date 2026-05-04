import { UserSchema } from '#database/schema'
import { manyToMany, beforeSave, column } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'

export default class User extends UserSchema {
  @column({ isPrimary: true })
  declare id: number

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @manyToMany(() => Role, {
    pivotTable: 'role_users',
    onQuery: (query: any) => {
      query.whereNull('role_users.deleted_at').whereExists((sub: any) => {
        sub.from('roles').whereColumn('roles.id', 'role_users.role_id').whereNull('roles.deleted_at')
      })
    },
  })
  declare roles: ManyToMany<typeof Role>

  private _permissionsCache: string[] | null = null

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  /**
   * Helper to verify user credentials
   */
  static async verifyCredentials(email: string, password: string) {
    const user = await this.query().where('email', email).whereNull('deleted_at').first()
    if (!user) return null

    const isVerified = await hash.verify(user.password, password)
    return isVerified ? user : null
  }

  /**
   * Helper to check if user has a specific permission
   */
  async hasPermission(permissionSlug: string): Promise<boolean> {
    const permissions = await this.getPermissions()
    return permissions.includes(permissionSlug)
  }

  /**
   * Helper to check if user has any of the given permissions
   */
  async hasAnyPermission(permissionSlugs: string[]): Promise<boolean> {
    const permissions = await this.getPermissions()
    return permissionSlugs.some((slug) => permissions.includes(slug))
  }

  /**
   * Helper to check if user has a specific role
   */
  async hasRole(roleSlug: string): Promise<boolean> {
    if (!this.roles) {
      await (this as any).load('roles')
    }
    return this.roles.some((role) => role.slug === roleSlug)
  }

  /**
   * Get all permission slugs for the user
   */
  async getPermissions(): Promise<string[]> {
    if (this._permissionsCache !== null) {
      return this._permissionsCache
    }

    if (!this.roles || !this.roles.every((role) => role.permissions)) {
      await (this as any).load('roles', (query: any) => {
        query.preload('permissions')
      })
    }

    const slugs = new Set<string>()
    this.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        slugs.add(permission.slug)
      })
    })

    this._permissionsCache = Array.from(slugs)
    return this._permissionsCache
  }
}
