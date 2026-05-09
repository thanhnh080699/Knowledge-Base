import Setting from '#models/setting'
import Post from '#models/post'
import Category from '#models/category'
import Tag from '#models/tag'
import Project from '#models/project'
import Tool from '#models/tool'
import { DateTime } from 'luxon'

type SitemapUrl = {
  loc: string
  lastmod: string
  changefreq?: string
  priority?: string
}

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
    const sections = ['static', 'posts', 'categories', 'tags', 'projects', 'tools']

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    for (const section of sections) {
      xml += `
  <sitemap>
    <loc>${this.escapeXml(`${siteUrl}/sitemap-${section}.xml`)}</loc>
    <lastmod>${DateTime.now().toISO()}</lastmod>
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
    let urls: SitemapUrl[] = []

    switch (section) {
      case 'static':
        urls = this.getStaticUrls(siteUrl)
        break
      case 'posts':
        const posts = await Post.query()
          .where('status', 'PUBLISHED')
          .whereNull('deleted_at')
          .preload('category')
          .orderBy('updated_at', 'desc')
        urls = posts.map((p) => ({
          loc: `${siteUrl}/docs/${p.category?.slug ?? 'general'}/${p.slug}`,
          lastmod: p.updatedAt?.toISO() || '',
          changefreq: 'weekly',
          priority: '0.8',
        }))
        break
      case 'categories':
        const categories = await Category.query().orderBy('updated_at', 'desc')
        urls = categories.map((c) => ({
          loc: `${siteUrl}/docs/categories/${c.slug}`,
          lastmod: c.updatedAt?.toISO() || '',
          changefreq: 'monthly',
          priority: '0.5',
        }))
        break
      case 'tags':
        const tags = await Tag.query().orderBy('updated_at', 'desc')
        urls = tags.map((t) => ({
          loc: `${siteUrl}/docs?tag=${t.slug}`,
          lastmod: t.updatedAt?.toISO() || '',
          changefreq: 'monthly',
          priority: '0.3',
        }))
        break
      case 'projects':
        const projects = await Project.query()
          .where('status', 'PUBLISHED')
          .orderBy('updated_at', 'desc')
        urls = projects.map((p) => ({
          loc: `${siteUrl}/projects/${p.slug}`,
          lastmod: p.updatedAt?.toISO() || '',
          changefreq: 'monthly',
          priority: '0.7',
        }))
        break
      case 'tools':
        const tools = await Tool.query()
          .where('status', 'PUBLISHED')
          .whereNull('deleted_at')
          .orderBy('updated_at', 'desc')
        urls = tools.map((tool) => ({
          loc: `${siteUrl}/tools/${tool.slug}`,
          lastmod: tool.updatedAt?.toISO() || '',
          changefreq: 'monthly',
          priority: tool.featured ? '0.7' : '0.6',
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
    <loc>${this.escapeXml(url.loc)}</loc>
    <lastmod>${this.escapeXml(url.lastmod)}</lastmod>
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

  private getStaticUrls(siteUrl: string): SitemapUrl[] {
    const lastmod = DateTime.now().toISO() || ''

    return [
      { loc: `${siteUrl}/`, lastmod, changefreq: 'daily', priority: '1.0' },
      { loc: `${siteUrl}/docs`, lastmod, changefreq: 'daily', priority: '0.9' },
      { loc: `${siteUrl}/projects`, lastmod, changefreq: 'weekly', priority: '0.8' },
      { loc: `${siteUrl}/portfolio`, lastmod, changefreq: 'monthly', priority: '0.7' },
      { loc: `${siteUrl}/tools`, lastmod, changefreq: 'weekly', priority: '0.8' },
      { loc: `${siteUrl}/contact`, lastmod, changefreq: 'monthly', priority: '0.6' },
    ]
  }

  private escapeXml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
}
