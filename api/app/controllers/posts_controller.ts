import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'

export default class PostsController {
  /**
   * @index
   * @description Display a list of posts with filtering and pagination
   * @tag POSTS
   * @paramQuery page - Current page number - example: 1
   * @paramQuery limit - Number of records per page - example: 10
   * @paramQuery categoryId - Filter by category ID - example: 1
   * @paramQuery tagId - Filter by tag ID - example: 1
   * @paramQuery status - Filter by status - example: DRAFT
   * @responseBody 200 - <Post[]>.paginate
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const categoryId = request.input('categoryId')
    const tagId = request.input('tagId')
    const status = request.input('status')

    const query = Post.query()
      .preload('category')
      .preload('tags')
      .preload('series')
      .orderBy('createdAt', 'desc')

    if (categoryId) {
      query.where('categoryId', categoryId)
    }

    if (tagId) {
      query.whereHas('tags', (tagQuery) => {
        tagQuery.where('tags.id', tagId)
      })
    }

    if (status) {
      query.where('status', status)
    }

    const posts = await query.paginate(page, limit)
    return response.ok(posts)
  }

  /**
   * @store
   * @description Create a new post
   * @tag POSTS
   * @requestBody <Post>
   * @responseBody 201 - { data: <Post> }
   * @responseHeader 201 - Set-Cookie - Cookie for authentication
   */
  async store({ request, response }: HttpContext) {
    const { tagIds, ...payload } = await request.validateUsing(createPostValidator)

    const post = new Post()
    post.fill(payload)

    // Ensure foreign keys are null if undefined
    post.categoryId = payload.categoryId || null
    post.seriesId = payload.seriesId || null

    await post.save()

    if (tagIds) {
      await post.related('tags').attach(tagIds)
    }

    await post.load('category')
    await post.load('tags')
    await post.load('series')

    return response.created({ data: post })
  }

  /**
   * @show
   * @description Show an individual post by ID or Slug
   * @tag POSTS
   * @paramPath id - The post ID or Slug - example: "my-first-post"
   * @responseBody 200 - { data: <Post> }
   */
  async show({ params, response }: HttpContext) {
    const post = await Post.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .preload('category')
      .preload('tags')
      .preload('series')
      .firstOrFail()

    return response.ok({ data: post })
  }

  /**
   * @update
   * @description Update an existing post
   * @tag POSTS
   * @paramPath id - The post ID - example: 1
   * @requestBody <Post>
   * @responseBody 200 - { data: <Post> }
   */
  async update({ params, request, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const {
      tagIds,
      params: validatorParams,
      ...payload
    } = await request.validateUsing(updatePostValidator, {
      meta: { params },
    })
    void validatorParams

    post.merge(payload)

    if (payload.categoryId !== undefined) {
      post.categoryId = payload.categoryId || null
    }
    if (payload.seriesId !== undefined) {
      post.seriesId = payload.seriesId || null
    }

    await post.save()

    if (tagIds) {
      await post.related('tags').sync(tagIds)
    }

    await post.load('category')
    await post.load('tags')
    await post.load('series')

    return response.ok({ data: post })
  }

  /**
   * @destroy
   * @description Delete a post
   * @tag POSTS
   * @paramPath id - The post ID - example: 1
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.noContent()
  }
}
