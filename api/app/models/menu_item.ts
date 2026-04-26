import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Menu from '#models/menu'

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare menuId: number

  @column()
  declare parentId: number | null

  @column()
  declare title: string

  @column()
  declare url: string | null

  @column()
  declare type: 'CUSTOM' | 'PAGE' | 'POST' | 'CATEGORY' | 'TAG'

  @column()
  declare referenceId: number | null

  @column()
  declare target: '_self' | '_blank'

  @column()
  declare cssClass: string | null

  @column()
  declare rel: string | null

  @column()
  declare sortOrder: number

  @belongsTo(() => Menu)
  declare menu: BelongsTo<typeof Menu>

  @belongsTo(() => MenuItem, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof MenuItem>

  @hasMany(() => MenuItem, { foreignKey: 'parentId' })
  declare children: HasMany<typeof MenuItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
