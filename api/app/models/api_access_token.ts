import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { createHash, randomBytes } from 'node:crypto'

export type ApiTokenPermission = string

function parsePermissions(value: unknown): ApiTokenPermission[] {
  if (Array.isArray(value)) return value as ApiTokenPermission[]
  if (typeof value !== 'string') return []

  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export default class ApiAccessToken extends BaseModel {
  static table = 'api_access_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ serializeAs: null })
  declare tokenHash: string

  @column({
    prepare: (value: ApiTokenPermission[]) => JSON.stringify(value ?? []),
    consume: parsePermissions,
  })
  declare permissions: ApiTokenPermission[]

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime()
  declare lastUsedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  declare plainToken?: string

  @beforeCreate()
  static assignToken(token: ApiAccessToken) {
    const plainToken = `thn_${randomBytes(32).toString('hex')}`
    token.plainToken = plainToken
    token.tokenHash = ApiAccessToken.hashToken(plainToken)
  }

  static hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }

  get isExpired() {
    return this.expiresAt ? this.expiresAt <= DateTime.utc() : false
  }

  hasPermission(permission: string) {
    return this.permissions.includes(permission) || this.permissions.includes('*')
  }
}
