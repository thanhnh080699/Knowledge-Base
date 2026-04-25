import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withUuid } from '#models/helpers/uuid_mixin'
import { compose } from '@adonisjs/core/helpers'

export default class Newsletter extends compose(BaseModel, withUuid) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}