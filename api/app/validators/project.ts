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
 * Validator to use when creating a project
 */
export const createProjectValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: slug().unique({ table: 'projects', column: 'slug' }),
    description: vine.string().trim(),
    techStack: vine.array(vine.string().trim()).optional(),
    thumbnailUrl: vine.string().trim().optional(),
    demoUrl: vine.string().trim().url().optional(),
    repoUrl: vine.string().trim().url().optional(),
    featured: vine.boolean().optional(),
  })
)

/**
 * Validator to use when updating a project
 */
export const updateProjectValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: slug()
      .unique({
        table: 'projects',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    description: vine.string().trim().optional(),
    techStack: vine.array(vine.string().trim()).optional(),
    thumbnailUrl: vine.string().trim().optional(),
    demoUrl: vine.string().trim().url().optional(),
    repoUrl: vine.string().trim().url().optional(),
    featured: vine.boolean().optional(),
  })
)
