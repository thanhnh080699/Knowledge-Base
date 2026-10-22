#!/usr/bin/env node
/**
 * CLI runner for blog-publisher
 *
 * Commands:
 *   verify                             - Test Content API connection & token permissions
 *   categories                         - List available categories with IDs and slugs
 *   tags                               - List tags
 *   upload-media <file> <folder>       - Upload a single image to CDN
 *   create-draft <spec.json> [--dry-run] [--update] - Upload images & create draft post
 *   preview <spec.json> <out.html>     - Generate local QA preview HTML
 *   publish <post-id> --confirm        - Explicitly publish a draft post with UTC timestamp
 */

import { readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { ContentApiClient } from './content-api.ts'
import type { ArticleDraftSpec, CreatePostPayload, QAReport } from './types.ts'

function parseArgs(args: string[]) {
  const flags: Record<string, boolean | string> = {}
  const positionals: string[] = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      if (key.includes('=')) {
        const [k, v] = key.split('=')
        flags[k] = v
      } else if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        flags[key] = args[++i]
      } else {
        flags[key] = true
      }
    } else {
      positionals.push(arg)
    }
  }

  return { flags, positionals }
}

async function run() {
  const rawArgs = process.argv.slice(2)
  const { flags, positionals } = parseArgs(rawArgs)
  const command = positionals[0]

  const dryRun = Boolean(flags['dry-run'] || process.env.DRY_RUN === 'true')
  const client = new ContentApiClient({ dryRun })

  if (!command || command === 'help') {
    console.log(`
Usage:
  node --experimental-strip-types cli.ts verify
  node --experimental-strip-types cli.ts categories
  node --experimental-strip-types cli.ts tags
  node --experimental-strip-types cli.ts upload-media <filePath> [folder]
  node --experimental-strip-types cli.ts create-draft <specFile.json> [--dry-run] [--update]
  node --experimental-strip-types cli.ts preview <specFile.json> [out.html]
  node --experimental-strip-types cli.ts publish <postId> --confirm [--dry-run]
`)
    process.exit(0)
  }

  switch (command) {
    case 'verify': {
      console.log('--- Verifying Content API Authentication & Scopes ---')
      const result = await client.verifyConnection()
      console.log(JSON.stringify(result, null, 2))
      break
    }

    case 'categories': {
      const categories = await client.getCategories()
      console.table(
        categories.map((c) => ({
          ID: c.id,
          Name: c.name,
          Slug: c.slug,
          ParentID: c.parentId ?? '-',
        }))
      )
      break
    }

    case 'tags': {
      const tags = await client.getTags()
      console.table(
        tags.map((t) => ({
          ID: t.id,
          Name: t.name,
          Slug: t.slug,
        }))
      )
      break
    }

    case 'upload-media': {
      const filePath = positionals[1]
      const folder = positionals[2] || 'blog/general'
      if (!filePath) {
        console.error('Error: filePath is required for upload-media')
        process.exit(1)
      }
      const absPath = resolve(filePath)
      const res = await client.uploadMediaFile(absPath, folder)
      console.log(JSON.stringify(res, null, 2))
      break
    }

    case 'create-draft': {
      const specPath = positionals[1]
      if (!specPath) {
        console.error('Error: specFile.json is required for create-draft')
        process.exit(1)
      }

      const rawSpec = await readFile(resolve(specPath), 'utf-8')
      const spec: ArticleDraftSpec = JSON.parse(rawSpec)
      const updateIfExists = Boolean(flags['update'])

      console.log(`Processing draft creation for: "${spec.title}" (slug: ${spec.slug})`)

      // 1. Resolve Category ID
      let categoryId = spec.categoryId
      if (!categoryId && spec.categorySlug) {
        const cat = await client.getCategoryBySlug(spec.categorySlug)
        if (!cat) {
          throw new Error(`Category with slug "${spec.categorySlug}" not found on server.`)
        }
        categoryId = cat.id
      }

      // 2. Resolve Tag IDs
      let tagIds = spec.tagIds || []
      if (spec.tagSlugs && spec.tagSlugs.length > 0) {
        const allTags = await client.getTags()
        const resolvedTagIds = spec.tagSlugs.map((slug) => {
          const t = allTags.find((tag) => tag.slug === slug)
          if (!t) throw new Error(`Tag with slug "${slug}" not found on server.`)
          return t.id
        })
        tagIds = Array.from(new Set([...tagIds, ...resolvedTagIds]))
      }

      // 3. Process and Upload Images
      let coverImageRelativePath: string | undefined
      let updatedContent = spec.content

      if (spec.images && spec.images.length > 0) {
        console.log(`Processing ${spec.images.length} image assets...`)
        for (const img of spec.images) {
          const imgFolder = img.folder || `blog/${spec.categorySlug || 'general'}/${spec.slug}`
          const uploadRes = await client.uploadMediaFile(resolve(img.localPath), imgFolder)

          const cdnFullUrl = uploadRes.url.startsWith('https://')
            ? uploadRes.url
            : `https://cdn.thanhnh.id.vn/${uploadRes.url.replace(/^\/?(medias\/)?/, 'medias/')}`

          if (img.isCover) {
            coverImageRelativePath = uploadRes.path
          }

          // Replace placeholder tokens in content: e.g. {{cover}}, {{flowchart}}, or local filenames
          const placeholderPattern = new RegExp(`{{\\s*${img.id}\\s*}}`, 'g')
          updatedContent = updatedContent.replace(placeholderPattern, cdnFullUrl)

          const baseFileName = basename(img.localPath)
          updatedContent = updatedContent.replace(new RegExp(`(["'])(?:\\./|assets/)?${baseFileName}(["'])`, 'g'), `$1${cdnFullUrl}$2`)
        }
      }

      // 4. Construct Payload
      const payload: CreatePostPayload = {
        title: spec.title,
        slug: spec.slug,
        content: updatedContent,
        excerpt: spec.excerpt,
        metaTitle: spec.metaTitle || spec.title,
        metaDescription: spec.metaDescription || spec.excerpt,
        focusKeyword: spec.focusKeyword,
        canonicalUrl: spec.canonicalUrl || `https://thanhnh.id.vn/docs/${spec.slug}`,
        coverImage: coverImageRelativePath,
        status: 'DRAFT',
        categoryId,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      }

      // 5. Submit Draft
      const result = await client.createDraftPost(payload, { updateIfExists, dryRun })
      console.log('\n--- Draft Operation Summary ---')
      console.log(`Action: ${result.action.toUpperCase()}`)
      console.log(`Post ID: ${result.post.id}`)
      console.log(`Title: ${result.post.title}`)
      console.log(`Slug: ${result.post.slug}`)
      console.log(`Status: ${result.post.status}`)
      console.log(`Canonical URL: ${result.post.canonicalUrl}`)
      if (result.post.coverImage) console.log(`Cover Image Path: ${result.post.coverImage}`)

      const outResultFile = specPath.replace(/\.json$/, '-created.json')
      await writeFile(outResultFile, JSON.stringify(result, null, 2), 'utf-8')
      console.log(`Result saved to: ${outResultFile}`)
      break
    }

    case 'preview': {
      const specPath = positionals[1]
      const outHtmlPath = positionals[2] || specPath.replace(/\.json$/, '-preview.html')
      if (!specPath) {
        console.error('Error: specFile.json is required for preview')
        process.exit(1)
      }

      const rawSpec = await readFile(resolve(specPath), 'utf-8')
      const spec: ArticleDraftSpec = JSON.parse(rawSpec)

      const report = generateQAReport(spec)
      const html = renderPreviewHtml(spec, report)

      await writeFile(resolve(outHtmlPath), html, 'utf-8')
      console.log(`Preview generated at: ${outHtmlPath}`)
      console.log('\n--- QA Report ---')
      console.log(`Word Count: ${report.wordCount}`)
      console.log(`H1 in body: ${report.hasH1InBody ? 'FAILED (Body must not have H1)' : 'PASSED'}`)
      console.log(`Em dashes (—): ${report.emDashCount} (Target: 0)`)
      console.log(`Images: ${report.images.length} (Target: 3)`)
      console.log(`Missing TOC targets: ${report.missingTocTargets.length > 0 ? report.missingTocTargets.join(', ') : 'None'}`)
      break
    }

    case 'publish': {
      const postIdStr = positionals[1]
      const confirm = Boolean(flags['confirm'])
      if (!postIdStr) {
        console.error('Error: postId is required for publish')
        process.exit(1)
      }
      if (!confirm) {
        console.error('CRITICAL: --confirm flag is required to publish. Example: publish 123 --confirm')
        process.exit(1)
      }

      const postId = Number(postIdStr)
      if (Number.isNaN(postId)) {
        console.error(`Error: Invalid numeric post ID "${postIdStr}"`)
        process.exit(1)
      }

      console.log(`Publishing Post ID ${postId}...`)
      const published = await client.publishPost(postId, { confirm: true, dryRun })
      console.log('--- Post Published Successfully ---')
      console.log(JSON.stringify({ id: published.id, title: published.title, slug: published.slug, status: published.status, publishedAt: published.publishedAt }, null, 2))
      break
    }

    default:
      console.error(`Unknown command: ${command}`)
      process.exit(1)
  }
}

function generateQAReport(spec: ArticleDraftSpec): QAReport {
  const content = spec.content || ''
  const words = content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean)
  const contentWithoutCode = content.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, '').replace(/```[\s\S]*?```/g, '')
  const hasH1 = /<h1\b/i.test(content) || /^#\s+/m.test(contentWithoutCode)

  const h2Matches = (content.match(/<h2\b/gi) || []).length
  const h3Matches = (content.match(/<h3\b/gi) || []).length
  const h4Matches = (content.match(/<h4\b/gi) || []).length

  // Check em-dash
  const emDashes = (content.match(/—/g) || []).length

  // Forbidden stock AI phrases
  const aiPhrases = ['đóng vai trò quan trọng', 'không phải là một chuyện đơn giản', 'trong thế giới ngày nay', 'tóm lại là']
  const foundAi = aiPhrases.filter((p) => content.toLowerCase().includes(p))

  // TOC targets check
  const tocHrefMatches = Array.from(content.matchAll(/href=["']#([^"']+)["']/g)).map((m) => m[1])
  const idsInDoc = Array.from(content.matchAll(/id=["']([^"']+)["']/g)).map((m) => m[1])
  const missingToc = tocHrefMatches.filter((href) => !idsInDoc.includes(href))

  const fk = (spec.focusKeyword || '').toLowerCase()

  return {
    slug: spec.slug,
    title: spec.title,
    wordCount: words.length,
    hasH1InBody: hasH1,
    headingsCount: { h2: h2Matches, h3: h3Matches, h4: h4Matches },
    missingTocTargets: missingToc,
    emDashCount: emDashes,
    forbiddenAIPhrases: foundAi,
    images: (spec.images || []).map((img) => ({
      id: img.id,
      hasAlt: Boolean(img.alt),
      hasCaption: Boolean(img.caption),
      isAbsoluteCdnUrl: false,
      url: img.localPath,
    })),
    internalLinks: [],
    seo: {
      metaTitleLength: (spec.metaTitle || spec.title).length,
      metaDescriptionLength: (spec.metaDescription || spec.excerpt || '').length,
      focusKeywordInTitle: fk ? spec.title.toLowerCase().includes(fk) : false,
      focusKeywordInDescription: fk ? (spec.metaDescription || spec.excerpt || '').toLowerCase().includes(fk) : false,
      focusKeywordInSlug: fk ? spec.slug.includes(fk.replace(/\s+/g, '-')) : false,
    },
    isReadyForDraft: !hasH1 && emDashes === 0 && missingToc.length === 0,
    isReadyForPublish: false,
  }
}

function renderPreviewHtml(spec: ArticleDraftSpec, report: QAReport): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Preview: ${spec.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.7; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #292524; background: #f5f5f5; }
    .card { background: white; border-radius: 16px; border: 1px solid #e7e5e4; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .badge-pass { background: #dcfce7; color: #166534; }
    .badge-fail { background: #fee2e2; color: #991b1b; }
    h1 { font-family: 'EB Garamond', serif; color: #0c0a09; font-size: 36px; font-weight: 500; line-height: 1.25; margin-top: 0; }
    h2 { font-family: 'EB Garamond', serif; color: #0c0a09; font-size: 28px; font-weight: 500; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px; margin-top: 36px; }
    h3 { font-family: 'EB Garamond', serif; color: #0c0a09; font-size: 22px; font-weight: 500; margin-top: 28px; }
    p, li { color: #4e4e4e; font-size: 16px; line-height: 1.75; }
    blockquote { border-left: 3px solid #d6d3d1; padding-left: 18px; margin: 24px 0; color: #44403c; font-style: italic; }
    pre { background: #0c0a09; color: #f5f5f5; padding: 18px; border-radius: 12px; overflow-x: auto; font-size: 14px; }
    code { font-family: ui-monospace, Menlo, Consolas, monospace; }
    img { max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #e7e5e4; }
    figure { margin: 28px 0; text-align: center; }
    figcaption { font-size: 14px; color: #78716c; margin-top: 10px; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 15px; }
    th, td { border: 1px solid #e7e5e4; padding: 12px 16px; text-align: left; }
    th { background: #fafafa; font-weight: 600; color: #0c0a09; }
    details { background: #fafafa; border: 1px solid #e7e5e4; border-radius: 10px; padding: 16px 20px; margin: 24px 0; }
    summary { font-weight: 600; cursor: pointer; color: #0c0a09; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <span class="badge ${report.isReadyForDraft ? 'badge-pass' : 'badge-fail'}">QA: ${report.isReadyForDraft ? 'PASSED READY FOR DRAFT' : 'CHECK NEEDED'}</span>
      <span style="font-size: 13px; color: #6b7280;">Từ ngữ: ${report.wordCount} | Em-dash: ${report.emDashCount} | H1 trong body: ${report.hasH1InBody ? 'Có (LỖI)' : 'Không'}</span>
    </div>
    <h1>${spec.title}</h1>
    <div style="font-size: 14px; color: #4b5563; margin-bottom: 20px;">
      <strong>Slug:</strong> <code>${spec.slug}</code> | <strong>Focus Keyword:</strong> <code>${spec.focusKeyword || 'N/A'}</code><br>
      <strong>Meta Title:</strong> ${spec.metaTitle || spec.title} (${report.seo.metaTitleLength} ký tự)<br>
      <strong>Meta Description:</strong> ${spec.metaDescription || spec.excerpt || 'N/A'} (${report.seo.metaDescriptionLength} ký tự)
    </div>
  </div>

  <div class="card">
    <h2>Nội dung bài viết</h2>
    <div class="post-content">
      ${spec.content}
    </div>
  </div>
</body>
</html>`
}

run().catch((err) => {
  console.error('\n[FATAL ERROR]:', err.message)
  process.exit(1)
})
