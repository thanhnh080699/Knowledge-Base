import vine from '@vinejs/vine'

const slug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/)

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(50),
    slug: slug().unique({ table: 'roles', column: 'slug' }),
    description: vine.string().trim().maxLength(255).optional(),
    permissionIds: vine
      .array(vine.string().uuid().exists({ table: 'permissions', column: 'id' }))
      .optional(),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    name: vine.string().trim().minLength(2).maxLength(50).optional(),
    slug: slug()
      .unique({
        table: 'roles',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    description: vine.string().trim().maxLength(255).nullable().optional(),
    permissionIds: vine
      .array(vine.string().uuid().exists({ table: 'permissions', column: 'id' }))
      .optional(),
  })
)
