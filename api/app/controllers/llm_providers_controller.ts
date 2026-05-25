import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import LlmProvider from '#models/llm_provider'
import LlmProviderService from '#services/llm_provider_service'
import {
  createLlmProviderValidator,
  testSavedLlmProviderValidator,
  updateLlmProviderValidator,
} from '#validators/llm_provider'

export default class LlmProvidersController {
  private llmProviderService = new LlmProviderService()

  /**
   * @index
   * @tag SETTINGS
   * @description List LLM providers
   * @responseBody 200 - { data: [<LlmProvider>] }
   */
  async index({ response }: HttpContext) {
    const providers = await LlmProvider.query()
      .whereNull('deleted_at')
      .orderBy('sort_order', 'asc')
      .orderBy('created_at', 'desc')

    return response.ok({ data: providers })
  }

  /**
   * @store
   * @tag SETTINGS
   * @description Create an LLM provider
   * @requestBody { name, driver, modelName, apiKey, baseUrl, tasks, isActive }
   * @responseBody 201 - { data: <LlmProvider> }
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createLlmProviderValidator)
    const defaults = this.llmProviderService.getDefaultConfig(payload.driver)

    const provider = await LlmProvider.create({
      name: payload.name,
      driver: payload.driver,
      modelName: payload.modelName,
      apiKey: payload.apiKey || null,
      baseUrl: payload.baseUrl || defaults.baseUrl || null,
      tasks: payload.tasks,
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? 0,
    })

    return response.created({ data: provider })
  }

  /**
   * @update
   * @tag SETTINGS
   * @description Update an LLM provider
   * @paramPath id - Provider ID
   * @requestBody { name, driver, modelName, apiKey, baseUrl, tasks, isActive }
   * @responseBody 200 - { data: <LlmProvider> }
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateLlmProviderValidator, {
      meta: { params },
    })
    const provider = await LlmProvider.query()
      .where('id', payload.params.id)
      .whereNull('deleted_at')
      .firstOrFail()
    const driver = payload.driver ?? provider.driver
    const defaults = this.llmProviderService.getDefaultConfig(driver)

    provider.merge({
      name: payload.name ?? provider.name,
      driver,
      modelName: payload.modelName ?? provider.modelName,
      apiKey:
        payload.apiKey === undefined || payload.apiKey === '' ? provider.apiKey : payload.apiKey,
      baseUrl:
        payload.baseUrl === undefined
          ? provider.baseUrl || defaults.baseUrl || null
          : payload.baseUrl || null,
      tasks: payload.tasks ?? provider.tasks,
      isActive: payload.isActive ?? provider.isActive,
      sortOrder: payload.sortOrder ?? provider.sortOrder,
    })
    await provider.save()

    return response.ok({ data: provider })
  }

  /**
   * @destroy
   * @tag SETTINGS
   * @description Soft delete an LLM provider
   * @paramPath id - Provider ID
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const provider = await LlmProvider.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()

    provider.deletedAt = DateTime.utc()
    await provider.save()

    return response.noContent()
  }

  /**
   * @testSavedProvider
   * @tag SETTINGS
   * @description Test saved LLM provider connection
   * @paramPath id - Provider ID
   * @responseBody 200 - { data: { connected, modelFound, modelsCount } }
   */
  async testSavedProvider({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(testSavedLlmProviderValidator, {
      meta: { params },
    })
    const provider = await LlmProvider.query()
      .where('id', payload.params.id)
      .whereNull('deleted_at')
      .firstOrFail()

    try {
      const result = await this.llmProviderService.testConnection({
        driver: provider.driver,
        apiKey: provider.apiKey || undefined,
        baseUrl: provider.baseUrl || undefined,
        modelName: provider.modelName,
      })

      return response.ok({
        data: result,
        message: 'LLM provider connection verified successfully',
      })
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : 'Unable to connect to LLM provider',
      })
    }
  }
}
