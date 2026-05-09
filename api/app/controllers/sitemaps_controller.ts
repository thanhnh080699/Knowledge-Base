import type { HttpContext } from '@adonisjs/core/http'
import SitemapService from '#services/sitemap_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SitemapsController {
  constructor(protected sitemapService: SitemapService) {}

  async index({ response }: HttpContext) {
    const xml = await this.sitemapService.generateIndex()
    if (!xml) {
      return response.notFound('Sitemap is disabled')
    }

    return response.header('Content-Type', 'application/xml').send(xml)
  }

  async static({ response }: HttpContext) {
    return this.respondWithSection('static', response)
  }

  async posts({ response }: HttpContext) {
    return this.respondWithSection('posts', response)
  }

  async categories({ response }: HttpContext) {
    return this.respondWithSection('categories', response)
  }

  async tags({ response }: HttpContext) {
    return this.respondWithSection('tags', response)
  }

  async projects({ response }: HttpContext) {
    return this.respondWithSection('projects', response)
  }

  async tools({ response }: HttpContext) {
    return this.respondWithSection('tools', response)
  }

  async section({ params, response }: HttpContext) {
    const section = String(params.section).replace(/\.xml$/, '')
    return this.respondWithSection(section, response)
  }

  private async respondWithSection(section: string, response: HttpContext['response']) {
    const xml = await this.sitemapService.generateSection(section)
    if (!xml) {
      return response.notFound(`Sitemap section "${section}" not found or disabled`)
    }

    return response.header('Content-Type', 'application/xml').send(xml)
  }
}
