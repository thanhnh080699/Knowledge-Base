import { DateTime } from 'luxon'
import { BaseModel, column, afterSave, afterDelete } from '@adonisjs/lucid/orm'
import { clearSitemapCache } from '#helpers/sitemap'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column()
  declare image: string | null

  @column()
  declare icon: string | null

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
