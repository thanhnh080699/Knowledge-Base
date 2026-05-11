import vine from '@vinejs/vine'

export const EXPIRATION_OPTIONS = ['1_week', '1_month', '1_year', 'no_expire'] as const

const permissionSlug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_.-]+$/)

export const createApiAccessTokenValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    expiresIn: vine.enum(EXPIRATION_OPTIONS),
    permissions: vine.array(permissionSlug()).minLength(1),
  })
)

export const updateApiAccessTokenValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    expiresIn: vine.enum(EXPIRATION_OPTIONS).optional(),
    permissions: vine.array(permissionSlug()).minLength(1).optional(),
  })
)
