import vine from '@vinejs/vine'

export const createPublicCommentValidator = vine.compile(
  vine.object({
    authorName: vine.string().trim().minLength(2).maxLength(120),
    authorEmail: vine.string().trim().email().maxLength(255),
    authorWebsite: vine.string().trim().url().optional(),
    content: vine.string().trim().minLength(2).maxLength(5000),
    parentId: vine.number().exists({ table: 'comments', column: 'id' }).optional(),
  })
)

export const adminCommentStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['PENDING', 'APPROVED', 'SPAM']),
  })
)

export const adminReplyCommentValidator = vine.compile(
  vine.object({
    authorName: vine.string().trim().minLength(2).maxLength(120).optional(),
    authorEmail: vine.string().trim().email().maxLength(255).optional(),
    authorWebsite: vine.string().trim().url().optional(),
    content: vine.string().trim().minLength(2).maxLength(5000),
    status: vine.enum(['PENDING', 'APPROVED', 'SPAM']).optional(),
  })
)
