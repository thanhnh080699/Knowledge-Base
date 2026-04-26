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

    return response
      .header('Content-Type', 'application/xml')
      .send(xml)
  }

  async section({ params, response }: HttpContext) {
    const section = params.section
    const xml = await this.sitemapService.generateSection(section)
    if (!xml) {
      return response.notFound(`Sitemap section "${section}" not found or disabled`)
    }

    return response
      .header('Content-Type', 'application/xml')
      .send(xml)
  }
}
