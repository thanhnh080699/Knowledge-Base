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

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
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
