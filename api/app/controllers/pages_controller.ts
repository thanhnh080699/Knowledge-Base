import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Page from '#models/page'
import { createPageValidator, updatePageValidator } from '#validators/page'

export default class PagesController {
  /**
   * @index
   * @description Display a list of pages with filtering and pagination
   * @tag PAGES
   * @responseBody 200 - <Page[]>.paginate
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const status = request.input('status')
    const search = request.input('search') || request.input('q')
    const trashed = request.input('trashed')

    const query = Page.query().orderBy('updated_at', 'desc')

    if (trashed === true || trashed === 'true' || trashed === '1') {
      query.whereNotNull('deleted_at')
    } else {
      query.whereNull('deleted_at')
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

    const pages = await query.paginate(page, limit)
    return response.ok(pages)
  }

  /**
   * @store
   * @description Create a new page
   * @tag PAGES
   * @requestBody <Page>
   * @responseBody 201 - { data: <Page> }
   */
  async store({ request, response }: HttpContext) {
    const { publishedAt, isHomepage, ...payload } = await request.validateUsing(createPageValidator)

    if (isHomepage) {
      await Page.query().where('is_homepage', true).update({ is_homepage: false })
    }

    const page = new Page()
    page.fill(payload)
    page.isHomepage = isHomepage ?? false
    page.publishedAt = publishedAt ? DateTime.fromISO(publishedAt) : null
    await page.save()

    return response.created({ data: page })
  }

  /**
   * @show
   * @description Show an individual page by ID or slug
   * @tag PAGES
   * @paramPath id - The page ID or slug
   * @responseBody 200 - { data: <Page> }
   */
  async show({ params, response }: HttpContext) {
    const page = await Page.query()
      .where((builder) => {
        builder.where('id', params.id).orWhere('slug', params.id)
      })
      .whereNull('deleted_at')
      .firstOrFail()

    return response.ok({ data: page })
  }

  /**
   * @homepage
   * @description Show the default homepage
   * @tag PAGES
   * @responseBody 200 - { data: <Page> }
   */
  async homepage({ response }: HttpContext) {
    const page = await Page.query()
      .where('is_homepage', true)
      .where('status', 'PUBLISHED')
      .whereNull('deleted_at')
      .firstOrFail()

    return response.ok({ data: page })
  }

  /**
   * @update
   * @description Update an existing page
   * @tag PAGES
   * @paramPath id - The page ID
   * @requestBody <Page>
   * @responseBody 200 - { data: <Page> }
   */
  async update({ params, request, response }: HttpContext) {
    const page = await Page.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    const {
      publishedAt,
      isHomepage,
      params: validatorParams,
      ...payload
    } = await request.validateUsing(updatePageValidator, {
      meta: { params },
    })
    void validatorParams

    if (isHomepage) {
      await Page.query().whereNot('id', page.id).where('is_homepage', true).update({
        is_homepage: false,
      })
    }

    page.merge(payload)
    if (isHomepage !== undefined) page.isHomepage = isHomepage
    if (publishedAt !== undefined) {
      page.publishedAt = publishedAt ? DateTime.fromISO(publishedAt) : null
    }
    await page.save()

    return response.ok({ data: page })
  }

  /**
   * @setHomepage
   * @description Set a page as the default homepage
   * @tag PAGES
   * @paramPath id - The page ID
   * @responseBody 200 - { data: <Page> }
   */
  async setHomepage({ params, response }: HttpContext) {
    const page = await Page.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    await Page.query().where('is_homepage', true).update({ is_homepage: false })
    page.isHomepage = true
    await page.save()

    return response.ok({ data: page })
  }

  /**
   * @destroy
   * @description Move a page to trash
   * @tag PAGES
   * @paramPath id - The page ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const page = await Page.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
    page.deletedAt = DateTime.utc()
    if (page.isHomepage) page.isHomepage = false
    await page.save()
    return response.noContent()
  }

  async restore({ params, response }: HttpContext) {
    const page = await Page.query().where('id', params.id).whereNotNull('deleted_at').firstOrFail()
    page.deletedAt = null
    await page.save()
    return response.ok({ data: page })
  }

  async forceDestroy({ params, response }: HttpContext) {
    const page = await Page.query().where('id', params.id).whereNotNull('deleted_at').firstOrFail()
    await page.delete()
    return response.noContent()
  }
}
