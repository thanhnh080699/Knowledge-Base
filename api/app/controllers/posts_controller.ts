import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Post from '#models/post'
import Category from '#models/category'
import { createPostValidator, updatePostValidator } from '#validators/post'
import { normalizeMediaFields } from '#helpers/media'

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
    const category = request.input('category')
    const tagId = request.input('tagId')
    const tag = request.input('tag')
    const status = request.input('status')
    const search = request.input('search') || request.input('q')
    const trashed = request.input('trashed')

    const query = Post.query()
      .preload('category')
      .preload('tags')
      .preload('series')
      .orderBy('publishedAt', 'desc')
      .orderBy('createdAt', 'desc')

    if (trashed === true || trashed === 'true' || trashed === '1') {
      query.whereNotNull('deleted_at')
    } else {
      query.whereNull('deleted_at')
    }

    if (categoryId) {
      const categoryIds = await this.getDescendantIds(Number(categoryId))
      categoryIds.push(Number(categoryId))
      query.whereIn('categoryId', categoryIds)
    }

    if (category) {
      const targetCategory = await Category.findBy('slug', category)
      if (targetCategory) {
        const categoryIds = await this.getDescendantIds(targetCategory.id)
        categoryIds.push(targetCategory.id)
        query.whereIn('categoryId', categoryIds)
      }
    }

    if (tagId) {
      query.whereHas('tags', (tagQuery) => {
        tagQuery.where('tags.id', tagId)
      })
    }

    if (tag) {
      query.whereHas('tags', (tagQuery) => {
        tagQuery.where('tags.slug', tag)
      })
    }

    if (status) {
      query.where('status', status)
    }

    if (search) {
      query.where((builder) => {
        builder
          .where('title', 'like', `%${search}%`)
          .orWhere('slug', 'like', `%${search}%`)
          .orWhere('excerpt', 'like', `%${search}%`)
          .orWhere('content', 'like', `%${search}%`)
      })
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
    const { tagIds, publishedAt, ...validatedPayload } =
      await request.validateUsing(createPostValidator)
    const payload = normalizeMediaFields(validatedPayload, ['coverImage'])

    const post = new Post()
    post.fill(payload)
    post.publishedAt = publishedAt ? DateTime.fromISO(publishedAt) : null

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
      .where((builder) => {
        builder.where('id', params.id).orWhere('slug', params.id)
      })
      .whereNull('deleted_at')
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
      publishedAt,
      params: validatorParams,
      ...validatedPayload
    } = await request.validateUsing(updatePostValidator, {
      meta: { params },
    })
    void validatorParams
    const payload = normalizeMediaFields(validatedPayload, ['coverImage'])

    post.merge(payload)

    if (publishedAt !== undefined) {
      post.publishedAt = publishedAt ? DateTime.fromISO(publishedAt) : null
    }

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
    const post = await Post.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    post.deletedAt = DateTime.utc()
    await post.save()
    return response.noContent()
  }

  /**
   * @restore
   * @description Restore a soft-deleted post
   * @tag POSTS
   * @paramPath id - The post ID - example: 1
   * @responseBody 200 - { data: <Post> }
   */
  async restore({ params, response }: HttpContext) {
    const post = await Post.query().where('id', params.id).whereNotNull('deleted_at').firstOrFail()
    post.deletedAt = null
    await post.save()

    await post.load('category')
    await post.load('tags')
    await post.load('series')

    return response.ok({ data: post })
  }

  /**
   * @forceDestroy
   * @description Permanently delete a post
   * @tag POSTS
   * @paramPath id - The post ID - example: 1
   * @responseBody 204 - No content
   */
  async forceDestroy({ params, response }: HttpContext) {
    const post = await Post.query().where('id', params.id).whereNotNull('deleted_at').firstOrFail()
    await post.related('tags').detach()
    await post.delete()
    return response.noContent()
  }

  /**
   * Get all descendant category IDs for a given parent category ID
   */
  private async getDescendantIds(parentId: number): Promise<number[]> {
    const allCategories = await Category.query().select('id', 'parentId')
    const descendants: number[] = []

    const findChildren = (id: number) => {
      const children = allCategories.filter((c) => c.parentId === id)
      for (const child of children) {
        descendants.push(child.id)
        findChildren(child.id)
      }
    }

    findChildren(parentId)
    return descendants
  }
}
