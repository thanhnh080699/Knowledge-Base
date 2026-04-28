import type { HttpContext } from '@adonisjs/core/http'
import QuestionAnswer from '#models/question_answer'
import Post from '#models/post'
import {
  createQuestionAnswerValidator,
  updateQuestionAnswerValidator,
} from '#validators/question_answer'

export default class QuestionAnswersController {
  /**
   * @index
   * @tag QUESTION ANSWERS
   * @description Display a public list of published question answers
   * @responseBody 200 - { data: <QuestionAnswer[]> }
   */
  async publicForPost({ params, response }: HttpContext) {
    const post = await Post.query()
      .where((builder) => {
        builder.where('id', params.postId).orWhere('slug', params.postId)
      })
      .whereNull('deleted_at')
      .firstOrFail()

    const query = QuestionAnswer.query()
      .where('postId', post.id)
      .where('isPublished', true)
      .orderBy('sortOrder', 'asc')
      .orderBy('createdAt', 'desc')

    const questionAnswers = await query
    return response.ok({ data: questionAnswers })
  }

  /**
   * @index
   * @tag QUESTION ANSWERS
   * @description Display a public list of published question answers
   * @responseBody 200 - { data: <QuestionAnswer[]> }
   */
  async publicIndex({ request, response }: HttpContext) {
    const postId = request.input('postId')

    const query = QuestionAnswer.query()
      .where('isPublished', true)
      .orderBy('sortOrder', 'asc')
      .orderBy('createdAt', 'desc')

    if (postId) {
      query.where('postId', postId)
    }

    const questionAnswers = await query
    return response.ok({ data: questionAnswers })
  }

  /**
   * @index
   * @tag QUESTION ANSWERS
   * @description Display a paginated admin list of question answers
   * @responseBody 200 - <QuestionAnswer[]>.paginate
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')
    const postId = request.input('postId')
    const published = request.input('published')

    const query = QuestionAnswer.query()
      .preload('post')
      .orderBy('sortOrder', 'asc')
      .orderBy('createdAt', 'desc')

    if (search) {
      query.where((builder) => {
        builder.whereILike('question', `%${search}%`).orWhereILike('answer', `%${search}%`)
      })
    }

    if (postId) {
      query.where('postId', postId)
    }

    if (published !== undefined) {
      query.where('isPublished', published === 'true' || published === '1')
    }

    const questionAnswers = await query.paginate(page, limit)
    return response.ok(questionAnswers)
  }

  /**
   * @store
   * @tag QUESTION ANSWERS
   * @description Create a new question answer
   * @requestBody <QuestionAnswer>
   * @responseBody 201 - { data: <QuestionAnswer> }
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createQuestionAnswerValidator)
    const questionAnswer = await QuestionAnswer.create(payload)
    await questionAnswer.load('post')
    return response.created({ data: questionAnswer })
  }

  /**
   * @show
   * @tag QUESTION ANSWERS
   * @description Show an individual question answer
   * @paramPath id - The question answer ID
   * @responseBody 200 - { data: <QuestionAnswer> }
   */
  async show({ params, response }: HttpContext) {
    const questionAnswer = await QuestionAnswer.query()
      .where('id', params.id)
      .preload('post')
      .firstOrFail()
    return response.ok({ data: questionAnswer })
  }

  /**
   * @update
   * @tag QUESTION ANSWERS
   * @description Update an existing question answer
   * @paramPath id - The question answer ID
   * @requestBody <QuestionAnswer>
   * @responseBody 200 - { data: <QuestionAnswer> }
   */
  async update({ params, request, response }: HttpContext) {
    const questionAnswer = await QuestionAnswer.findOrFail(params.id)
    const payload = await request.validateUsing(updateQuestionAnswerValidator)

    questionAnswer.merge(payload)
    await questionAnswer.save()
    await questionAnswer.load('post')

    return response.ok({ data: questionAnswer })
  }

  /**
   * @destroy
   * @tag QUESTION ANSWERS
   * @description Delete a question answer
   * @paramPath id - The question answer ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const questionAnswer = await QuestionAnswer.findOrFail(params.id)
    await questionAnswer.delete()
    return response.noContent()
  }
}
