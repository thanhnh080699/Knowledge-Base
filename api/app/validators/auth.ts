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

/**
 * Validator to validate the update profile request body
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(2).maxLength(255).optional(),
    email: vine.string().email().normalizeEmail().optional(),
  })
)

/**
 * Validator to validate the change password request body
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(4),
    newPassword: vine.string().minLength(4).confirmed({ confirmationField: 'newPassword_confirmation' }),
  })
)