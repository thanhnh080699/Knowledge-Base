import vine from '@vinejs/vine'

const slug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9.-]+$/)

export const createPermissionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(50),
    slug: slug().unique({ table: 'permissions', column: 'slug' }),
    module: vine.string().trim().toLowerCase().minLength(2).maxLength(50),
  })
)

export const updatePermissionValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid(),
    }),
    name: vine.string().trim().minLength(2).maxLength(50).optional(),
    slug: slug()
      .unique({
        table: 'permissions',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    module: vine.string().trim().toLowerCase().minLength(2).maxLength(50).optional(),
  })
)
