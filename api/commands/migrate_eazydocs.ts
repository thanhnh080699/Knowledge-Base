import { BaseCommand, flags } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import Post from '#models/post'
import Category from '#models/category'
import Series from '#models/series'
import Tag from '#models/tag'
import { DateTime } from 'luxon'
import slugify from 'slugify'
import CdnMediaService from '#services/cdn_media_service'
import { writeFile, unlink, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, basename } from 'node:path'
import env from '#start/env'

export default class MigrateEazydocs extends BaseCommand {
  static commandName = 'migrate:eazydocs'
  static description = 'Migrate EazyDocs posts from WordPress to the new system'

  @flags.boolean({ description: 'Run migration without saving to database' })
  declare dryRun: boolean

  @flags.boolean({ description: 'Migrate media files to CDN', default: true })
  declare migrateMedia: boolean

  static options = {
    startApp: true,
  }

  private cdn = new CdnMediaService()
  private seriesMap = new Map<number, number>() // wp_id -> local_id
  private categoryMap = new Map<number, number>() // wp_id -> local_id
  private sysAdminCatId: number | null = null

  async run() {
    this.logger.info('Starting EazyDocs migration...')

    try {
      // 1. Fetch all docs from WordPress
      const wpDocs = await db
        .connection('wordpress')
        .from('wp_posts')
        .where('post_type', 'docs')
        .whereIn('post_status', ['publish', 'private', 'draft'])
        .orderBy('post_parent', 'asc')
        .orderBy('menu_order', 'asc')

      this.logger.info(`Found ${wpDocs.length} documentation entries in WordPress.`)

      // Organize docs by level
      const rootDocs = wpDocs.filter((d) => Number(d.post_parent) === 0)
      const sectionDocs = wpDocs.filter((d) => rootDocs.some((r) => Number(d.post_parent) === r.ID))
      const articleDocs = wpDocs.filter(
        (d) =>
          !rootDocs.some((r) => r.ID === d.ID) && !sectionDocs.some((s) => s.ID === d.ID)
      )

      this.logger.info(`Structure: ${rootDocs.length} Series, ${sectionDocs.length} Categories, ${articleDocs.length} Articles.`)

      // Step 0: Ensure Parent Categories exist
      if (!this.dryRun) {
        let sysAdmin = await Category.findBy('slug', 'system-administrator')
        if (!sysAdmin) sysAdmin = await Category.create({ name: 'System Administrator', slug: 'system-administrator' })
        this.sysAdminCatId = sysAdmin.id

        let helpDesk = await Category.findBy('slug', 'help-desk')
        if (!helpDesk) await Category.create({ name: 'Help Desk', slug: 'help-desk' })

        let devOps = await Category.findBy('slug', 'dev-ops')
        if (!devOps) await Category.create({ name: 'Dev Ops', slug: 'dev-ops' })
      }

      // Step 1: Migrate Root Docs -> Series
      for (const wpDoc of rootDocs) {
        await this.migrateToSeries(wpDoc)
      }

      // Step 2: Migrate Section Docs -> Categories
      for (const wpDoc of sectionDocs) {
        await this.migrateToCategory(wpDoc)
      }

      // Step 3: Migrate Article Docs -> Posts
      for (const wpDoc of articleDocs) {
        await this.migrateToPost(wpDoc)
      }

      this.logger.success('Migration completed successfully!')
    } catch (error: any) {
      this.logger.error(`Migration failed at post: ${this.currentPostTitle || 'unknown'}`)
      this.logger.error('Error message: ' + error.message)
      if (error.stack) {
        console.error(error.stack)
      }
    }
  }

  private currentPostTitle: string = ''

  private async migrateToSeries(wpDoc: any) {
    const slug = wpDoc.post_name || slugify(wpDoc.post_title, { lower: true })
    
    let series = await Series.findBy('slug', slug)
    if (!series) {
      this.logger.info(`✚ Creating Series: ${wpDoc.post_title}`)
      if (!this.dryRun) {
        series = await Series.create({
          name: wpDoc.post_title,
          slug: slug,
          description: wpDoc.post_excerpt || null,
        })
      }
    } else {
      this.logger.info(`✓ Found existing Series: ${wpDoc.post_title}`)
    }

    if (series) {
      this.seriesMap.set(wpDoc.ID, series.id)
    }
  }

  private async migrateToCategory(wpDoc: any) {
    const slug = wpDoc.post_name || slugify(wpDoc.post_title, { lower: true })
    
    let category = await Category.findBy('slug', slug)
    if (!category) {
      this.logger.info(`  ✚ Creating Category: ${wpDoc.post_title}`)
      if (!this.dryRun) {
        category = await Category.create({
          name: wpDoc.post_title,
          slug: slug,
          description: wpDoc.post_excerpt || null,
          parentId: this.sysAdminCatId,
        })
      }
    } else {
      if (!this.dryRun && category.parentId !== this.sysAdminCatId) {
        category.parentId = this.sysAdminCatId
        await category.save()
      }
      this.logger.info(`  ✓ Found existing Category: ${wpDoc.post_title}`)
    }

    if (category) {
      this.categoryMap.set(wpDoc.ID, category.id)
    }
  }

  private async migrateToPost(wpDoc: any) {
    this.currentPostTitle = wpDoc.post_title
    const slug = wpDoc.post_name || slugify(wpDoc.post_title, { lower: true })
    
    // Check if post already exists (by wordpress_id)
    let post = await Post.findBy('wordpressId', wpDoc.ID)
    
    if (post) {
      this.logger.info(`    ✓ Updating Post [ID: ${post.id}]: ${wpDoc.post_title}`)
    } else {
      this.logger.info(`    ✚ Creating Post: ${wpDoc.post_title}`)
      post = new Post()
    }

    // Determine IDs
    let parentId = Number(wpDoc.post_parent)
    let categoryId = this.categoryMap.get(parentId) || null
    if (!categoryId && this.sysAdminCatId) {
       // If no category was mapped, place it directly under System Administrator
       categoryId = this.sysAdminCatId
    }
    
    // Find Series ID (either from parent or grandparent)
    let seriesId = this.seriesMap.get(parentId) || null
    if (!seriesId && categoryId) {
       // If parent was a category, find its parent (the series)
       const wpParent = await db.connection('wordpress').from('wp_posts').where('ID', parentId).first()
       if (wpParent && wpParent.post_parent) {
         seriesId = this.seriesMap.get(Number(wpParent.post_parent)) || null
       }
    }

    // Fetch Meta
    const meta = await this.getWPMeta(wpDoc.ID)

    if (!this.dryRun) {
      let content = wpDoc.post_content
      let coverImage = meta.thumbnail

      if (this.migrateMedia) {
        content = await this.processContentMedia(content)
        if (coverImage) {
          coverImage = await this.downloadAndUpload(coverImage)
        }
      }

      this.logger.info(`      → Saving Post [ID: ${post.id}, Persisted: ${post.$isPersisted}]`)
      this.logger.info(`      → Final Cover Image Path: ${coverImage || 'none'}`)
      
      post.merge({
        wordpressId: wpDoc.ID,
        title: wpDoc.post_title,
        slug: slug,
        content: content,
        excerpt: wpDoc.post_excerpt || null,
        status: wpDoc.post_status === 'publish' ? 'PUBLISHED' : wpDoc.post_status === 'draft' ? 'DRAFT' : 'ARCHIVED',
        categoryId: categoryId ?? null,
        seriesId: seriesId ?? null,
        publishedAt: DateTime.fromJSDate(new Date(wpDoc.post_date)),
        metaTitle: meta.title || null,
        metaDescription: meta.description || null,
        focusKeyword: meta.keywords || null,
        coverImage: coverImage || null,
      })
      await post.save()

      // Sync Tags
      const wpTags = await this.getWPTags(wpDoc.ID)
      if (wpTags.length > 0) {
        const tagIds: number[] = []
        for (const tagName of wpTags) {
          const tagSlug = slugify(tagName, { lower: true })
          let tag = await Tag.findBy('slug', tagSlug)
          if (!tag) {
            tag = await Tag.create({ name: tagName, slug: tagSlug })
          }
          tagIds.push(tag.id)
        }
        await post.related('tags').sync(tagIds)
      }
    }
  }

  private async getWPMeta(postId: number) {
    const metaRows = await db.connection('wordpress').from('wp_postmeta').where('post_id', postId)
    const meta: any = {}
    
    for (const row of metaRows) {
      if (row.meta_key === '_yoast_wpseo_title' || row.meta_key === 'rank_math_title') meta.title = row.meta_value
      if (row.meta_key === '_yoast_wpseo_metadesc' || row.meta_key === 'rank_math_description') meta.description = row.meta_value
      if (row.meta_key === '_yoast_wpseo_focuskw' || row.meta_key === 'rank_math_focus_keyword') meta.keywords = row.meta_value
      
      if (row.meta_key === '_thumbnail_id') {
        const thumbId = Number(row.meta_value)
        const thumbPost = await db.connection('wordpress').from('wp_posts').where('ID', thumbId).first()
        if (thumbPost) {
          meta.thumbnail = thumbPost.guid
        }
      }
    }
    return meta
  }

  private async getWPTags(postId: number) {
    const tags = await db.connection('wordpress')
      .from('wp_terms')
      .join('wp_term_taxonomy', 'wp_terms.term_id', 'wp_term_taxonomy.term_id')
      .join('wp_term_relationships', 'wp_term_taxonomy.term_taxonomy_id', 'wp_term_relationships.term_taxonomy_id')
      .where('wp_term_relationships.object_id', postId)
      .where('wp_term_taxonomy.taxonomy', 'doc_tag')
      .select('wp_terms.name')
    
    return tags.map((t: any) => t.name)
  }

  private async downloadAndUpload(url: string, folder: string = 'blog/eazydocs') {
    if (!url || !url.startsWith('http')) return url

    // Check if already on our CDN
    const cdnUrl = (env.get('CDN_URL') || '').replace(/\/$/, '')
    if (cdnUrl && url.startsWith(cdnUrl)) return url

    // Handle local WordPress uploads
    if (url.includes('thanhnh.id.vn/wp-content/uploads/')) {
      const relativePath = url.split('/wp-content/uploads/')[1]
      if (relativePath) {
        const localPath = join('/Volumes/EXT_DATA/Working/wordpress/wp-content/uploads', relativePath)
        let fileExists = false
        try {
          const stats = await stat(localPath)
          fileExists = stats.isFile()
        } catch (e) {}

        if (fileExists) {
          try {
            this.logger.info(`      📁 Using local file: ${localPath}`)
            const uploadRes = await this.cdn.upload<{ data: { url: string; path: string } }>({
              tmpPath: localPath,
              clientName: basename(localPath),
              folder,
            })
            if (uploadRes && uploadRes.data && uploadRes.data.path) {
              return uploadRes.data.path
            }
          } catch (error: any) {
            this.logger.error(`      ⚠ Local file upload failed: ${localPath} - ${error.message}`)
            return url // Don't download if local upload failed
          }
        }
      }
    }

    // Handle GitHub Camo URLs
    if (url.includes('camo.githubusercontent.com')) {
      const parts = url.split('/')
      const hex = parts[parts.length - 1]
      if (hex && /^[0-9a-f]+$/i.test(hex)) {
        try {
          const decoded = Buffer.from(hex, 'hex').toString('utf8')
          if (decoded.startsWith('http')) {
            this.logger.info(`      ⚑ Decoded Camo URL: ${decoded}`)
            url = decoded
          }
        } catch (e) {
          // ignore decoding errors
        }
      }
    }

    try {
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200))

      this.logger.info(`      ↓ Downloading: ${url}`)
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://thanhnh.id.vn/',
        },
      })
      if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`)

      const buffer = await response.arrayBuffer()
      const urlPath = new URL(url).pathname
      const fileName = basename(urlPath) || `image-${Date.now()}.png`
      const tmpPath = join(tmpdir(), `${Date.now()}-${fileName}`)

      await writeFile(tmpPath, Buffer.from(buffer))

      const uploadRes = await this.cdn.upload<{ data: { url: string; path: string } }>({
        tmpPath,
        clientName: fileName,
        folder,
        type: response.headers.get('content-type') || 'image/png',
      })

      await unlink(tmpPath)

      if (uploadRes && uploadRes.data && uploadRes.data.path) {
        return uploadRes.data.path
      }
    } catch (error: any) {
      this.logger.error(`      ⚠ Failed to migrate media: ${url} - ${error.message}`)
    }
    return url
  }

  private async processContentMedia(content: string) {
    const imgRegex = /<img[^>]+src="([^">]+)"/g
    let newContent = content

    const matches = [...content.matchAll(imgRegex)]
    for (const match of matches) {
      const oldUrl = match[1]
      const newUrl = await this.downloadAndUpload(oldUrl)
      if (newUrl !== oldUrl) {
        newContent = newContent.replaceAll(oldUrl, newUrl)
      }
    }
    return newContent
  }
}
