import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { createProjectValidator, updateProjectValidator } from '#validators/project'

export default class ProjectsController {
  /**
   * @index
   * @tag PROJECTS
   * @description Display a list of projects
   * @responseBody 200 - <Project[]>.paginate
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const featured = request.input('featured')

    const query = Project.query().orderBy('createdAt', 'desc')

    if (featured !== undefined) {
      query.where('featured', featured === 'true' || featured === '1')
    }

    const projects = await query.paginate(page, limit)
    return response.ok(projects)
  }

  /**
   * @store
   * @tag PROJECTS
   * @description Create a new project
   * @requestBody <Project>
   * @responseBody 201 - { data: <Project> }
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProjectValidator)
    const project = await Project.create(payload)
    return response.created({ data: project })
  }

  /**
   * @show
   * @tag PROJECTS
   * @description Show an individual project
   * @paramPath id - The project ID or Slug
   * @responseBody 200 - { data: <Project> }
   */
  async show({ params, response }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .firstOrFail()
    return response.ok({ data: project })
  }

  /**
   * @update
   * @tag PROJECTS
   * @description Update an existing project
   * @paramPath id - The project ID
   * @requestBody <Project>
   * @responseBody 200 - { data: <Project> }
   */
  async update({ params, request, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    const payload = await request.validateUsing(updateProjectValidator, {
      meta: { params },
    })

    project.merge(payload)
    await project.save()

    return response.ok({ data: project })
  }

  /**
   * @destroy
   * @tag PROJECTS
   * @description Delete a project
   * @paramPath id - The project ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return response.noContent()
  }
}
