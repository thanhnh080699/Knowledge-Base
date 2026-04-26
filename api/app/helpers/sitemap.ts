import SitemapService from '#services/sitemap_service'
import app from '@adonisjs/core/services/app'

export async function clearSitemapCache() {
  try {
    const sitemapService = await app.container.make(SitemapService)
    await sitemapService.clearCache()
    console.log('[Sitemap] Cache cleared due to content change')
  } catch (error) {
    console.error('[Sitemap] Failed to clear cache:', error)
  }
}
