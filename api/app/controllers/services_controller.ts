import type { HttpContext } from '@adonisjs/core/http'
import Service from '#models/service'
import { createServiceValidator, updateServiceValidator } from '#validators/service'

export default class ServicesController {
  /**
   * @index
   * @tag SERVICES
   * @description Display a list of services
   * @responseBody 200 - { data: <Service[]> }
   */
  async index({ request, response }: HttpContext) {
    const featured = request.input('featured')
    const query = Service.query().orderBy('name', 'asc')

    if (featured !== undefined) {
      query.where('featured', featured === 'true' || featured === '1')
    }

    const services = await query
    return response.ok({ data: services })
  }

  /**
   * @store
   * @tag SERVICES
   * @description Create a new service
   * @requestBody <Service>
   * @responseBody 201 - { data: <Service> }
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createServiceValidator)
    const service = await Service.create(payload)
    return response.created({ data: service })
  }

  /**
   * @show
   * @tag SERVICES
   * @description Show an individual service
   * @paramPath id - The service ID or Slug
   * @responseBody 200 - { data: <Service> }
   */
  async show({ params, response }: HttpContext) {
    const service = await Service.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .firstOrFail()
    return response.ok({ data: service })
  }

  /**
   * @update
   * @tag SERVICES
   * @description Update an existing service
   * @paramPath id - The service ID
   * @requestBody <Service>
   * @responseBody 200 - { data: <Service> }
   */
  async update({ params, request, response }: HttpContext) {
    const service = await Service.findOrFail(params.id)
    const payload = await request.validateUsing(updateServiceValidator, {
      meta: { params },
    })

    service.merge(payload)
    await service.save()

    return response.ok({ data: service })
  }

  /**
   * @destroy
   * @tag SERVICES
   * @description Delete a service
   * @paramPath id - The service ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const service = await Service.findOrFail(params.id)
    await service.delete()
    return response.noContent()
  }
}
