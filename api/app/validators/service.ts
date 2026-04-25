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
 * Validator to use when creating a service
 */
export const createServiceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    slug: slug().unique({ table: 'services', column: 'slug' }),
    description: vine.string().trim(),
    features: vine.array(vine.string().trim()).optional(),
    priceRange: vine.string().trim().optional(),
    category: vine.string().trim().optional(),
    featured: vine.boolean().optional(),
  })
)

/**
 * Validator to use when updating a service
 */
export const updateServiceValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid(),
    }),
    name: vine.string().trim().minLength(3).maxLength(100).optional(),
    slug: slug()
      .unique({
        table: 'services',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    description: vine.string().trim().optional(),
    features: vine.array(vine.string().trim()).optional(),
    priceRange: vine.string().trim().optional(),
    category: vine.string().trim().optional(),
    featured: vine.boolean().optional(),
  })
)
