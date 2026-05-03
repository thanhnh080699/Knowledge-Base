import { DateTime } from 'luxon'
import { BaseModel, column, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import { clearSitemapCache } from '#helpers/sitemap'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare content: string | null

  @column({
    prepare: (value: unknown) => {
      if (Array.isArray(value)) return JSON.stringify(value)
      if (typeof value === 'string') return value
      return JSON.stringify([])
    },
    consume: (value: unknown) => {
      if (Array.isArray(value)) return value
      if (!value) return []
      if (typeof value !== 'string') return []

      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      }
    },
  })
  declare techStack: any

  @column()
  declare thumbnailUrl: string | null

  @column()
  declare demoUrl: string | null

  @column()
  declare repoUrl: string | null

  @column()
  declare featured: boolean

  @column()
  declare status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterSave()
  static async clearSitemapAfterSave() {
    await clearSitemapCache()
  }

  @afterDelete()
  static async clearSitemapAfterDelete() {
    await clearSitemapCache()
  }
}
