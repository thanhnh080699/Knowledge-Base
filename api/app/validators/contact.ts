import vine from '@vinejs/vine'

/**
 * Validator to use when creating a contact request
 */
export const createContactRequestValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    email: vine.string().email().normalizeEmail(),
    subject: vine.string().trim().maxLength(255),
    message: vine.string().trim(),
  })
)

/**
 * Validator to use when subscribing to newsletter
 */
export const createNewsletterValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail().unique({ table: 'newsletters', column: 'email' }),
  })
)
