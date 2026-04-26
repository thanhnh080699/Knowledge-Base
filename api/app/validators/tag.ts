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
 * Validator to use when creating a tag
 */
export const createTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(50),
    slug: slug().unique({ table: 'tags', column: 'slug' }),
    description: vine.string().trim().optional(),
    metaTitle: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().optional(),
  })
)

/**
 * Validator to use when updating a tag
 */
export const updateTagValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    name: vine.string().trim().maxLength(50).optional(),
    description: vine.string().trim().optional(),
    metaTitle: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().optional(),
    slug: slug()
      .unique({
        table: 'tags',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
  })
)
