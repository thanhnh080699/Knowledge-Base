import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Tool from '#models/tool'
import { createToolValidator, updateToolValidator } from '#validators/tool'

export default class ToolsController {
  /**
   * @index
   * @tag TOOLS
   * @description Display a list of tools
   * @responseBody 200 - <Tool[]>.paginate
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const category = request.input('category')
    const featured = request.input('featured')
    const status = request.input('status')
    const search = request.input('q') || request.input('search')
    const isAdminRequest = request.url().includes('/admin/tools')

    const query = Tool.query()
      .whereNull('deleted_at')
      .orderBy('sortOrder', 'asc')
      .orderBy('createdAt', 'desc')

    if (!isAdminRequest) {
      query.where('status', 'PUBLISHED')
    } else if (status) {
      query.where('status', status)
    }

    if (category) {
      query.where('category', category)
    }

    if (featured !== undefined) {
      query.where('featured', featured === 'true' || featured === '1')
    }

    if (search) {
      query.where((builder) => {
        builder
          .whereILike('name', `%${search}%`)
          .orWhereILike('slug', `%${search}%`)
          .orWhereILike('description', `%${search}%`)
          .orWhereILike('category', `%${search}%`)
      })
    }

    const tools = await query.paginate(page, limit)
    return response.ok(tools)
  }

  /**
   * @store
   * @tag TOOLS
   * @description Create a new tool
   * @requestBody <Tool>
   * @responseBody 201 - { data: <Tool> }
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createToolValidator)
    const tool = await Tool.create(payload)
    return response.created({ data: tool })
  }

  /**
   * @show
   * @tag TOOLS
   * @description Show an individual tool
   * @paramPath id - The tool ID or Slug
   * @responseBody 200 - { data: <Tool> }
   */
  async show({ params, request, response }: HttpContext) {
    const isAdminRequest = request.url().includes('/admin/tools')
    const tool = await Tool.query()
      .whereNull('deleted_at')
      .where((builder) => {
        builder.where('id', params.id).orWhere('slug', params.id)
      })
      .if(!isAdminRequest, (query) => query.where('status', 'PUBLISHED'))
      .firstOrFail()
    return response.ok({ data: tool })
  }

  /**
   * @update
   * @tag TOOLS
   * @description Update an existing tool
   * @paramPath id - The tool ID
   * @requestBody <Tool>
   * @responseBody 200 - { data: <Tool> }
   */
  async update({ params, request, response }: HttpContext) {
    const tool = await Tool.query().whereNull('deleted_at').where('id', params.id).firstOrFail()
    const { params: _, ...toolPayload } = await request.validateUsing(updateToolValidator, {
      meta: { params },
    })
    void _

    tool.merge(toolPayload)
    await tool.save()

    return response.ok({ data: tool })
  }

  /**
   * @destroy
   * @tag TOOLS
   * @description Delete a tool (soft delete)
   * @paramPath id - The tool ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const tool = await Tool.query().whereNull('deleted_at').where('id', params.id).firstOrFail()
    tool.deletedAt = DateTime.now()
    await tool.save()
    return response.noContent()
  }
}
