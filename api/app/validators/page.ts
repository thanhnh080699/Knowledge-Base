import vine from '@vinejs/vine'

const slug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/)

export const createPageValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: slug().unique({ table: 'pages', column: 'slug' }),
    content: vine.string().trim(),
    excerpt: vine.string().trim().optional(),
    template: vine.string().trim().maxLength(100).optional(),
    coverImage: vine.string().trim().optional(),
    metaTitle: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().optional(),
    focusKeyword: vine.string().trim().maxLength(255).optional(),
    canonicalUrl: vine.string().trim().url().optional(),
    status: vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    isHomepage: vine.boolean().optional(),
    publishedAt: vine.string().trim().optional(),
  })
)

export const updatePageValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: slug()
      .unique({
        table: 'pages',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    content: vine.string().trim().optional(),
    excerpt: vine.string().trim().optional(),
    template: vine.string().trim().maxLength(100).optional(),
    coverImage: vine.string().trim().optional(),
    metaTitle: vine.string().trim().maxLength(255).optional(),
    metaDescription: vine.string().trim().optional(),
    focusKeyword: vine.string().trim().maxLength(255).optional(),
    canonicalUrl: vine.string().trim().url().optional(),
    status: vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    isHomepage: vine.boolean().optional(),
    publishedAt: vine.string().trim().optional(),
  })
)
