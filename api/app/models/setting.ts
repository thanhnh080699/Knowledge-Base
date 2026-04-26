import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type SettingValue = string | number | boolean | Record<string, unknown> | unknown[] | null

function parseSettingValue(value: unknown): SettingValue {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value !== 'string') {
    return value as SettingValue
  }

  try {
    return JSON.parse(value) as SettingValue
  } catch {
    return value
  }
}

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare settingGroup: string

  @column()
  declare settingKey: string

  @column({
    prepare: (value: SettingValue) => JSON.stringify(value),
    consume: parseSettingValue,
  })
  declare settingValue: SettingValue

  @column()
  declare type: 'string' | 'text' | 'email' | 'url' | 'boolean' | 'number' | 'select' | 'json'

  @column()
  declare label: string

  @column()
  declare description: string | null

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
