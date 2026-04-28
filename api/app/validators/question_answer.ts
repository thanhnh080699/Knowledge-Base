import vine from '@vinejs/vine'

export const createQuestionAnswerValidator = vine.compile(
  vine.object({
    postId: vine.number().exists({ table: 'posts', column: 'id' }),
    question: vine.string().trim().minLength(3).maxLength(500),
    answer: vine.string().trim().minLength(1),
    sortOrder: vine.number().min(0).optional(),
    isPublished: vine.boolean().optional(),
  })
)

export const updateQuestionAnswerValidator = vine.compile(
  vine.object({
    postId: vine.number().exists({ table: 'posts', column: 'id' }).optional(),
    question: vine.string().trim().minLength(3).maxLength(500).optional(),
    answer: vine.string().trim().minLength(1).optional(),
    sortOrder: vine.number().min(0).optional(),
    isPublished: vine.boolean().optional(),
  })
)
