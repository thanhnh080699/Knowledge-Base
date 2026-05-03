import Setting from '#models/setting'
import Post from '#models/post'
import Category from '#models/category'
import Tag from '#models/tag'
import Project from '#models/project'
import { DateTime } from 'luxon'

export default class SitemapService {
  private cache = new Map<string, { xml: string; expiresAt: number }>()

  private async getSetting(key: string, defaultValue: any = null) {
    const setting = await Setting.query().where('setting_key', key).first()
    return setting ? setting.settingValue : defaultValue
  }

  private async getSiteUrl() {
    return await this.getSetting('site_url', 'https://thanhnh.id.vn')
  }

  private async getCacheConfig() {
    const enabled = await this.getSetting('enable_sitemap_cache', true)
    const duration = await this.getSetting('sitemap_cache_duration', 60)
    return { enabled, duration }
  }

  private getCached(key: string) {
    const cached = this.cache.get(key)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.xml
    }
    return null
  }

  private setCache(key: string, xml: string, durationMinutes: number) {
    this.cache.set(key, {
      xml,
      expiresAt: Date.now() + durationMinutes * 60 * 1000,
    })
  }

  async clearCache() {
    this.cache.clear()
  }

  async generateIndex() {
    const isEnabled = await this.getSetting('enable_sitemap', true)
    if (!isEnabled) return null

    const cacheConfig = await this.getCacheConfig()
    if (cacheConfig.enabled) {
      const cached = this.getCached('index')
      if (cached) return cached
    }

    const siteUrl = await this.getSiteUrl()
    const sections = ['posts', 'categories', 'tags', 'projects']
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
    
    for (const section of sections) {
      xml += `
  <sitemap>
    <loc>${siteUrl}/sitemap-${section}.xml</loc>
    <lastmod>${DateTime.now().toISOString()}</lastmod>
  </sitemap>`
    }
    
    xml += `\n</sitemapindex>`

    if (cacheConfig.enabled) {
      this.setCache('index', xml, cacheConfig.duration)
    }

    return xml
  }

  async generateSection(section: string) {
    const isEnabled = await this.getSetting('enable_sitemap', true)
    if (!isEnabled) return null

    const cacheConfig = await this.getCacheConfig()
    if (cacheConfig.enabled) {
      const cached = this.getCached(section)
      if (cached) return cached
    }

    const siteUrl = await this.getSiteUrl()
    let urls: { loc: string; lastmod: string; changefreq?: string; priority?: string }[] = []

    switch (section) {
      case 'posts':
        const posts = await Post.query().where('status', 'PUBLISHED').orderBy('updated_at', 'desc')
        urls = posts.map((p) => ({
          loc: `${siteUrl}/docs/${p.slug}`,
          lastmod: p.updatedAt.toISOString(),
          changefreq: 'weekly',
          priority: '0.8',
        }))
        break
      case 'categories':
        const categories = await Category.query().orderBy('updated_at', 'desc')
        urls = categories.map((c) => ({
          loc: `${siteUrl}/docs?category=${c.slug}`,
          lastmod: c.updatedAt.toISOString(),
          changefreq: 'monthly',
          priority: '0.5',
        }))
        break
      case 'tags':
        const tags = await Tag.query().orderBy('updated_at', 'desc')
        urls = tags.map((t) => ({
          loc: `${siteUrl}/docs?tag=${t.slug}`,
          lastmod: t.updatedAt.toISOString(),
          changefreq: 'monthly',
          priority: '0.3',
        }))
        break
      case 'projects':
        const projects = await Project.query().where('status', 'PUBLISHED').orderBy('updated_at', 'desc')
        urls = projects.map((p) => ({
          loc: `${siteUrl}/projects/${p.slug}`,
          lastmod: p.updatedAt.toISOString(),
          changefreq: 'monthly',
          priority: '0.7',
        }))
        break
      default:
        return null
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    for (const url of urls) {
      xml += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    }

    xml += `\n</urlset>`

    if (cacheConfig.enabled) {
      this.setCache(section, xml, cacheConfig.duration)
    }

    return xml
  }
}
