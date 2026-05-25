import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { LlmDriver } from '#services/llm_provider_service'

export type LlmTask = string

function parseTasks(value: unknown): LlmTask[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value !== 'string') {
    return []
  }

  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export default class LlmProvider extends BaseModel {
  static table = 'llm_providers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare driver: LlmDriver

  @column()
  declare modelName: string

  @column({ serializeAs: null })
  declare apiKey: string | null

  @column()
  declare baseUrl: string | null

  @column({
    prepare: (value: LlmTask[]) => JSON.stringify(value ?? []),
    consume: parseTasks,
  })
  declare tasks: LlmTask[]

  @column()
  declare inputTokens: number

  @column()
  declare outputTokens: number

  @column()
  declare totalTokens: number

  @column()
  declare isActive: boolean

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
