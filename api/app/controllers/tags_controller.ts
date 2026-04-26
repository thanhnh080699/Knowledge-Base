import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'
import { createTagValidator, updateTagValidator } from '#validators/tag'

export default class TagsController {
  /**
   * @index
   * @tag TAGS
   * @description Display a list of tags
   * @responseBody 200 - { data: <Tag[]> }
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const q = request.input('q')

    const query = Tag.query().orderBy('name', 'asc')

    if (q) {
      query.where((builder) => {
        builder.where('name', 'like', `%${q}%`).orWhere('slug', 'like', `%${q}%`)
      })
    }

    if (page || limit) {
      const tags = await query.paginate(Number(page ?? 1), Number(limit ?? 20))
      return response.ok(tags)
    }

    const tags = await query
    return response.ok({ data: tags })
  }

  /**
   * @store
   * @tag TAGS
   * @description Create a new tag
   * @requestBody <Tag>
   * @responseBody 201 - { data: <Tag> }
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTagValidator)
    const tag = await Tag.create(payload)
    return response.created({ data: tag })
  }

  /**
   * @show
   * @tag TAGS
   * @description Show an individual tag
   * @paramPath id - The tag ID or Slug
   * @responseBody 200 - { data: <Tag> }
   */
  async show({ params, response }: HttpContext) {
    const tag = await Tag.query().where('id', params.id).orWhere('slug', params.id).firstOrFail()
    return response.ok({ data: tag })
  }

  /**
   * @update
   * @tag TAGS
   * @description Update an existing tag
   * @paramPath id - The tag ID
   * @requestBody <Tag>
   * @responseBody 200 - { data: <Tag> }
   */
  async update({ params, request, response }: HttpContext) {
    const tag = await Tag.findOrFail(params.id)
    const { params: validatorParams, ...payload } = await request.validateUsing(
      updateTagValidator,
      {
        meta: { params },
      }
    )
    void validatorParams

    tag.merge(payload)
    await tag.save()

    return response.ok({ data: tag })
  }

  /**
   * @destroy
   * @tag TAGS
   * @description Delete a tag
   * @paramPath id - The tag ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const tag = await Tag.findOrFail(params.id)
    await tag.delete()
    return response.noContent()
  }
}
