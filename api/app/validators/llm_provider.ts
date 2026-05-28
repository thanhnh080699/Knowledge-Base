import vine from '@vinejs/vine'

const llmDriver = () => vine.enum(['openai', 'gemini', 'nvidia', 'openrouter', 'custom'] as const)

const taskSlug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.-]+$/)

export const createLlmProviderValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    driver: llmDriver(),
    modelName: vine.string().trim().minLength(1).maxLength(255),
    apiKey: vine.string().trim().nullable().optional(),
    baseUrl: vine.string().trim().maxLength(500).nullable().optional(),
    tasks: vine.array(taskSlug()).minLength(1),
    isActive: vine.boolean().optional(),
    sortOrder: vine.number().min(0).optional(),
  })
)

export const updateLlmProviderValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    driver: llmDriver().optional(),
    modelName: vine.string().trim().minLength(1).maxLength(255).optional(),
    apiKey: vine.string().trim().nullable().optional(),
    baseUrl: vine.string().trim().maxLength(500).nullable().optional(),
    tasks: vine.array(taskSlug()).minLength(1).optional(),
    isActive: vine.boolean().optional(),
    sortOrder: vine.number().min(0).optional(),
  })
)

export const testSavedLlmProviderValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
  })
)
