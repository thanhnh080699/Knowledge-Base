import vine from '@vinejs/vine'

const slug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/)

export const createToolValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    slug: slug().unique({ table: 'tools', column: 'slug' }),
    description: vine.string().trim().optional(),
    category: vine.string().trim().minLength(2).maxLength(100),
    icon: vine.string().trim().optional(),
    urlPath: vine.string().trim().minLength(1),
    featured: vine.boolean().optional(),
    status: vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    sortOrder: vine.number().optional(),
  })
)

export const updateToolValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: slug()
      .unique({
        table: 'tools',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    description: vine.string().trim().optional(),
    category: vine.string().trim().minLength(2).maxLength(100).optional(),
    icon: vine.string().trim().optional(),
    urlPath: vine.string().trim().minLength(1).optional(),
    featured: vine.boolean().optional(),
    status: vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    sortOrder: vine.number().optional(),
  })
)
