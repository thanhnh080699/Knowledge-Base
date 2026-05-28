import vine from '@vinejs/vine'

const settingGroup = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_-]+$/)

const settingKey = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.-]+$/)

const settingType = () =>
  vine.enum(['string', 'text', 'email', 'url', 'boolean', 'number', 'select', 'json'] as const)

export const showSettingsGroupValidator = vine.compile(
  vine.object({
    params: vine.object({
      group: settingGroup(),
    }),
  })
)

export const updateSettingsGroupValidator = vine.compile(
  vine.object({
    params: vine.object({
      group: settingGroup(),
    }),
    settings: vine
      .array(
        vine.object({
          key: settingKey(),
          value: vine.any().optional(),
          type: settingType().optional(),
          label: vine.string().trim().maxLength(255).optional(),
          description: vine.string().trim().nullable().optional(),
          sortOrder: vine.number().min(0).optional(),
        })
      )
      .minLength(1),
  })
)

export const sendTestEmailValidator = vine.compile(
  vine.object({
    recipient: vine.string().email().normalizeEmail(),
  })
)

const llmDriver = () => vine.enum(['openai', 'gemini', 'nvidia', 'openrouter', 'custom'] as const)

export const listLlmModelsValidator = vine.compile(
  vine.object({
    driver: llmDriver(),
    apiKey: vine.string().trim().optional(),
    baseUrl: vine.string().trim().optional(),
  })
)

export const testLlmConnectionValidator = vine.compile(
  vine.object({
    driver: llmDriver(),
    apiKey: vine.string().trim(),
    baseUrl: vine.string().trim().optional(),
    modelName: vine.string().trim().optional(),
  })
)
