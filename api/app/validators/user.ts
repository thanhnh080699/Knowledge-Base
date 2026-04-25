import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254).normalizeEmail()
const password = () => vine.string().minLength(4).maxLength(32)

export const signupValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(255).optional(),
    email: email().unique({
      table: 'users',
      column: 'email',
      filter: (db) => db.whereNull('deleted_at').where('status', 'active'),
    }),
    password: password(),
  })
)

/**
 * Validator to use when creating a user from admin panel
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(255).optional(),
    email: email().unique({
      table: 'users',
      column: 'email',
      filter: (db) => db.whereNull('deleted_at').where('status', 'active'),
    }),
    password: password(),
    roleIds: vine.array(vine.number().exists({ table: 'roles', column: 'id' })).optional(),
  })
)

/**
 * Validator to use when updating a user from admin panel
 */
export const updateUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    fullName: vine.string().trim().maxLength(255).optional(),
    email: email()
      .unique({
        table: 'users',
        column: 'email',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id).whereNull('deleted_at').where('status', 'active')
        },
      })
      .optional(),
    password: password().optional(),
    roleIds: vine.array(vine.number().exists({ table: 'roles', column: 'id' })).optional(),
  })
)
