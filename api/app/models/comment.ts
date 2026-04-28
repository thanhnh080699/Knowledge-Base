import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Post from '#models/post'

export type CommentStatus = 'PENDING' | 'APPROVED' | 'SPAM'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: number

  @column()
  declare parentId: number | null

  @column()
  declare authorName: string

  @column()
  declare authorEmail: string

  @column()
  declare authorWebsite: string | null

  @column()
  declare content: string

  @column()
  declare status: CommentStatus

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column.dateTime()
  declare approvedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => Comment, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Comment>

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
  })
  declare replies: HasMany<typeof Comment>
}
