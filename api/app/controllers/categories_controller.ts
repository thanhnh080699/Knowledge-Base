import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import { normalizeMediaFields } from '#helpers/media'

export default class CategoriesController {
  /**
   * @index
   * @description Display a list of categories
   * @tag CATEGORIES
   * @responseBody 200 - { data: <Category[]> }
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const q = request.input('q')

    const query = Category.query().orderBy('name', 'asc')

    if (q) {
      query.where((builder) => {
        builder
          .where('name', 'like', `%${q}%`)
          .orWhere('slug', 'like', `%${q}%`)
          .orWhere('description', 'like', `%${q}%`)
      })
    }

    if (page || limit) {
      const categories = await query.paginate(Number(page ?? 1), Number(limit ?? 20))
      return response.ok(categories)
    }

    const categories = await query
    return response.ok({ data: categories })
  }

  /**
   * @store
   * @description Create a new category
   * @tag CATEGORIES
   * @requestBody <Category>
   * @responseBody 201 - { data: <Category> }
   */
  async store({ request, response }: HttpContext) {
    const validatedPayload = await request.validateUsing(createCategoryValidator)
    const payload = normalizeMediaFields(validatedPayload, ['image'])
    const category = await Category.create(payload)
    return response.created({ data: category })
  }

  /**
   * @show
   * @description Show an individual category
   * @tag CATEGORIES
   * @paramPath id - The category ID or Slug
   * @responseBody 200 - { data: <Category> }
   */
  async show({ params, response }: HttpContext) {
    const category = await Category.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .firstOrFail()
    return response.ok({ data: category })
  }

  /**
   * @update
   * @description Update an existing category
   * @tag CATEGORIES
   * @paramPath id - The category ID
   * @requestBody <Category>
   * @responseBody 200 - { data: <Category> }
   */
  async update({ params, request, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const { params: validatorParams, ...validatedPayload } = await request.validateUsing(
      updateCategoryValidator,
      {
        meta: { params },
      }
    )
    void validatorParams
    const payload = normalizeMediaFields(validatedPayload, ['image'])

    category.merge(payload)
    await category.save()

    return response.ok({ data: category })
  }

  /**
   * @destroy
   * @description Delete a category
   * @tag CATEGORIES
   * @paramPath id - The category ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.noContent()
  }
}
