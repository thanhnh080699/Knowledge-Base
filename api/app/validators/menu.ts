import vine from '@vinejs/vine'

const slug = () =>
  vine
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/)

const menuItem = vine.object({
  id: vine.number().optional(),
  parentId: vine.number().nullable().optional(),
  title: vine.string().trim().minLength(1).maxLength(255),
  url: vine.string().trim().optional(),
  type: vine.enum(['CUSTOM', 'PAGE', 'POST', 'CATEGORY', 'TAG']).optional(),
  referenceId: vine.number().nullable().optional(),
  target: vine.enum(['_self', '_blank']).optional(),
  cssClass: vine.string().trim().maxLength(255).optional(),
  rel: vine.string().trim().maxLength(255).optional(),
  sortOrder: vine.number().min(0).optional(),
})

export const createMenuValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    slug: slug().unique({ table: 'menus', column: 'slug' }),
    description: vine.string().trim().optional(),
    location: vine.string().trim().maxLength(100).optional(),
    isDefault: vine.boolean().optional(),
    items: vine.array(menuItem).optional(),
  })
)

export const updateMenuValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    slug: slug()
      .unique({
        table: 'menus',
        column: 'slug',
        filter: (db, _value, field) => {
          db.whereNot('id', field.data.params.id)
        },
      })
      .optional(),
    description: vine.string().trim().optional(),
    location: vine.string().trim().maxLength(100).optional(),
    isDefault: vine.boolean().optional(),
    items: vine.array(menuItem).optional(),
  })
)

export const syncMenuItemsValidator = vine.compile(
  vine.object({
    items: vine.array(menuItem),
  })
)
