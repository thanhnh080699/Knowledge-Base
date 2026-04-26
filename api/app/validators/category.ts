import vine from '@vinejs/vine'

/**
 * Shared rules for slug
 */
const slug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/)

/**
 * Validator to use when creating a category
 */
export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
    slug: slug().unique({ table: 'categories', column: 'slug' }),
    description: vine.string().trim().optional(),
    icon: vine.string().trim().optional(),
    color: vine.string().trim().optional(),
  })
)

/**
 * Validator to use when updating a category
 */
export const updateCategoryValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    name: vine.string().trim().maxLength(100).optional(),
    slug: slug()
      .unique({
        table: 'categories',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    description: vine.string().trim().optional(),
    icon: vine.string().trim().optional(),
    color: vine.string().trim().optional(),
  })
)
