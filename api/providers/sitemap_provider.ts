import { ApplicationService } from '@adonisjs/core/types'
import SitemapService from '#services/sitemap_service'

export default class SitemapProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.singleton(SitemapService, () => {
      return new SitemapService()
    })
  }
}
