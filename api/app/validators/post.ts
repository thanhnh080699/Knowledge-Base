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
 * Validator to use when creating a post
 */
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: slug().unique({ table: 'posts', column: 'slug' }),
    content: vine.string().trim(),
    excerpt: vine.string().trim().optional(),
    coverImage: vine.string().trim().optional(),
    status: vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    categoryId: vine.string().uuid().exists({ table: 'categories', column: 'id' }).optional(),
    seriesId: vine.string().uuid().exists({ table: 'series', column: 'id' }).optional(),
    tagIds: vine.array(vine.string().uuid().exists({ table: 'tags', column: 'id' })).optional(),
  })
)

/**
 * Validator to use when updating a post
 */
export const updatePostValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid(),
    }),
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: slug()
      .unique({
        table: 'posts',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    content: vine.string().trim().optional(),
    excerpt: vine.string().trim().optional(),
    coverImage: vine.string().trim().optional(),
    status: vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    categoryId: vine.string().uuid().exists({ table: 'categories', column: 'id' }).optional(),
    seriesId: vine.string().uuid().exists({ table: 'series', column: 'id' }).optional(),
    tagIds: vine.array(vine.string().uuid().exists({ table: 'tags', column: 'id' })).optional(),
  })
)
