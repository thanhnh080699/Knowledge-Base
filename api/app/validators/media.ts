import vine from '@vinejs/vine'

export const updateMediaValidator = vine.compile(
  vine.object({
    path: vine.string().trim(),
    alt: vine.string().trim().maxLength(160).optional(),
    align: vine.enum(['none', 'left', 'center', 'right']).optional(),
    displayWidth: vine.number().min(0).max(8192).optional(),
    displayHeight: vine.number().min(0).max(8192).optional(),
    format: vine.enum(['webp', 'jpg', 'jpeg', 'png']).optional(),
  })
)

export const createFolderValidator = vine.compile(
  vine.object({
    path: vine.string().trim(),
  })
)

export const renameFolderValidator = vine.compile(
  vine.object({
    oldPath: vine.string().trim(),
    newPath: vine.string().trim(),
  })
)

export const deleteFolderValidator = vine.compile(
  vine.object({
    path: vine.string().trim(),
  })
)

export const moveMediaValidator = vine.compile(
  vine.object({
    path: vine.string().trim(),
    folder: vine.string().trim().optional(),
  })
)
