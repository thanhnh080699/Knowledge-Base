import type { HttpContext } from '@adonisjs/core/http'
import ContactRequest from '#models/contact_request'
import Newsletter from '#models/newsletter'
import { createContactRequestValidator, createNewsletterValidator } from '#validators/contact'

export default class ContactsController {
  /**
   * @storeRequest
   * @tag CONTACTS
   * @description Store a new contact request
   * @requestBody <ContactRequest>
   * @responseBody 201 - { data: <ContactRequest> }
   */
  async storeRequest({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createContactRequestValidator)
    const contactRequest = await ContactRequest.create(payload)
    return response.created({ data: contactRequest })
  }

  /**
   * @subscribeNewsletter
   * @tag CONTACTS
   * @description Store a new newsletter subscription
   * @requestBody <Newsletter>
   * @responseBody 201 - { data: <Newsletter> }
   */
  async subscribeNewsletter({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createNewsletterValidator)
    const newsletter = await Newsletter.create(payload)
    return response.created({ data: newsletter })
  }

  /**
   * @indexRequests
   * @tag CONTACTS
   * @description Display a list of contact requests (Admin only)
   * @responseBody 200 - { data: <ContactRequest[]> }
   */
  async indexRequests({ response }: HttpContext) {
    const requests = await ContactRequest.query().orderBy('createdAt', 'desc')
    return response.ok({ data: requests })
  }

  /**
   * @indexNewsletters
   * @tag CONTACTS
   * @description Display a list of newsletter subscribers (Admin only)
   * @responseBody 200 - { data: <Newsletter[]> }
   */
  async indexNewsletters({ response }: HttpContext) {
    const newsletters = await Newsletter.query().orderBy('createdAt', 'desc')
    return response.ok({ data: newsletters })
  }

  /**
   * @updateRequest
   * @tag CONTACTS
   * @description Update a contact request status (Admin only)
   * @requestBody { status: string }
   * @responseBody 200 - { data: <ContactRequest> }
   */
  async updateRequest({ params, request, response }: HttpContext) {
    const contactRequest = await ContactRequest.findOrFail(params.id)
    const payload = await request.only(['status'])
    contactRequest.merge(payload)
    await contactRequest.save()
    return response.ok({ data: contactRequest })
  }

  /**
   * @destroyRequest
   * @tag CONTACTS
   * @description Delete a contact request (Admin only)
   * @responseBody 204
   */
  async destroyRequest({ params, response }: HttpContext) {
    const contactRequest = await ContactRequest.findOrFail(params.id)
    await contactRequest.delete()
    return response.noContent()
  }

  /**
   * @destroyNewsletter
   * @tag CONTACTS
   * @description Delete a newsletter subscription (Admin only)
   * @responseBody 204
   */
  async destroyNewsletter({ params, response }: HttpContext) {
    const newsletter = await Newsletter.findOrFail(params.id)
    await newsletter.delete()
    return response.noContent()
  }
}
