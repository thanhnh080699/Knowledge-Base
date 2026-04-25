import vine from '@vinejs/vine'

/**
 * Validator to validate the login request body
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(4),
  })
)