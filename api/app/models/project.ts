import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withUuid } from '#models/helpers/uuid_mixin'
import { compose } from '@adonisjs/core/helpers'

export default class Project extends compose(BaseModel, withUuid) {
  @column({ isPrimary: true })
  declare id: string

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
}