import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import { clearSitemapCache } from '#helpers/sitemap'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import Series from '#models/series'
import Tag from '#models/tag'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare wordpressId: number | null

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare excerpt: string | null

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column()
  declare focusKeyword: string | null

  @column()
  declare canonicalUrl: string | null

  @column()
  declare coverImage: string | null

  @column()
  declare status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

  @column()
  declare views: number

  @column()
  declare categoryId: number | null

  @column()
  declare seriesId: number | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Series)
  declare series: BelongsTo<typeof Series>

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @afterSave()
  static async clearSitemapAfterSave() {
    await clearSitemapCache()
  }

  @afterDelete()
  static async clearSitemapAfterDelete() {
    await clearSitemapCache()
  }
}
