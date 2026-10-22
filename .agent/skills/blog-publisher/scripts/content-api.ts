/**
 * Secure Content API Client for blog-publisher
 *
 * Security & Reliability guarantees:
 * 1. Token held in-memory only (retrieved from macOS Keychain or CONTENT_API_TOKEN env var).
 * 2. Origin lockdown: only communicates with verified origin, rejects cross-origin redirects.
 * 3. Exponential backoff retry with jitter on transient network / 5xx / 429 errors.
 * 4. Dry-run mode for safe testing without mutating database.
 * 5. Full logging with credential sanitization.
 */

import { execFileSync } from 'node:child_process'
import dns from 'node:dns'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

// Ensure local development resolves production IP when local system DNS fails
const KNOWN_HOSTS: Record<string, string> = {
  'api.thanhnh.id.vn': '42.114.11.199',
  'cdn.thanhnh.id.vn': '42.114.11.199',
  'thanhnh.id.vn': '42.114.11.199',
}

const originalLookup = dns.lookup
dns.lookup = function (hostname: any, options: any, callback: any) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (KNOWN_HOSTS[hostname]) {
    const ip = KNOWN_HOSTS[hostname]
    if (options && options.all) {
      return callback(null, [{ address: ip, family: 4 }])
    }
    return callback(null, ip, 4)
  }
  return originalLookup(hostname, options, callback)
} as typeof dns.lookup
import type {
  Category,
  CreatePostPayload,
  MediaUploadResponse,
  PaginatedResponse,
  Post,
  SingleResponse,
  Tag,
  UpdatePostPayload,
} from './types.ts'

export interface ClientOptions {
  origin?: string
  dryRun?: boolean
  maxRetries?: number
  baseTimeoutMs?: number
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
}

export class ContentApiClient {
  private readonly origin: string
  private readonly apiBase: string
  private readonly token: string
  private readonly dryRun: boolean
  private readonly maxRetries: number
  private readonly baseTimeoutMs: number
  private readonly logLevel: 'debug' | 'info' | 'warn' | 'error'

  constructor(options: ClientOptions = {}) {
    this.origin = (options.origin || process.env.CONTENT_API_ORIGIN || 'https://api.thanhnh.id.vn').replace(/\/+$/, '')
    this.apiBase = `${this.origin}/api`
    this.dryRun = Boolean(options.dryRun || process.env.DRY_RUN === 'true')
    this.maxRetries = options.maxRetries ?? 3
    this.baseTimeoutMs = options.baseTimeoutMs ?? 45000
    this.logLevel = options.logLevel || 'info'

    this.token = this.resolveToken()
    this.validateTargetOrigin()
  }

  /**
   * Resolves token securely without exposing it in logs or files.
   */
  private resolveToken(): string {
    if (process.env.CONTENT_API_TOKEN) {
      const tok = process.env.CONTENT_API_TOKEN.trim()
      if (tok) return tok
    }

    try {
      const output = execFileSync(
        '/usr/bin/security',
        ['find-generic-password', '-s', 'thanhnh.id.vn.production.content-api', '-a', 'content-automation', '-w'],
        { encoding: 'utf-8', timeout: 5000 }
      )
      const tok = output.trim()
      if (!tok) {
        throw new Error('Retrieved token from Keychain is empty.')
      }
      return tok
    } catch (err) {
      throw new Error(
        'Unable to retrieve Content API token from macOS Keychain or CONTENT_API_TOKEN environment variable. ' +
          'Ensure the credential exists in Keychain (service: thanhnh.id.vn.production.content-api, account: content-automation) ' +
          'or supply CONTENT_API_TOKEN in environment.'
      )
    }
  }

  private validateTargetOrigin(): void {
    try {
      const parsed = new URL(this.origin)
      if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
        throw new Error(`Insecure protocol "${parsed.protocol}" for remote Content API. Must be https:`)
      }
    } catch (e: any) {
      throw new Error(`Invalid Content API origin: ${this.origin} (${e.message})`)
    }
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: any): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    if (levels[level] < levels[this.logLevel]) return

    const timestamp = new Date().toISOString()
    const prefix = `[blog-publisher API ${level.toUpperCase()}] ${timestamp}`

    // Ensure token is never logged
    let sanitizedMeta = meta
    if (meta && typeof meta === 'object') {
      try {
        const json = JSON.stringify(meta)
        if (json.includes(this.token)) {
          sanitizedMeta = JSON.parse(json.replaceAll(this.token, '***REDACTED***'))
        }
      } catch {
        sanitizedMeta = '[Unserializable Meta]'
      }
    }

    if (level === 'error') {
      console.error(prefix, message, sanitizedMeta ?? '')
    } else if (level === 'warn') {
      console.warn(prefix, message, sanitizedMeta ?? '')
    } else {
      console.log(prefix, message, sanitizedMeta ?? '')
    }
  }

  /**
   * Safe fetch with exponential backoff and timeout
   */
  private async safeFetch(
    url: string,
    init: RequestInit,
    attempt: number = 1
  ): Promise<Response> {
    const targetUrl = new URL(url)
    const allowedOrigin = new URL(this.origin)

    if (targetUrl.origin !== allowedOrigin.origin) {
      throw new Error(`Disallowed cross-origin request to: ${targetUrl.origin}`)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.baseTimeoutMs)

    try {
      const response = await fetch(targetUrl.toString(), {
        ...init,
        redirect: 'error', // NEVER follow redirects automatically to prevent token leaks
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Retry on 429 or 5xx server errors
      if ((response.status === 429 || response.status >= 500) && attempt <= this.maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 15000)
        this.log('warn', `Received HTTP ${response.status} from ${url}. Retrying in ${Math.round(backoffMs)}ms (attempt ${attempt}/${this.maxRetries})...`)
        await new Promise((r) => setTimeout(r, backoffMs))
        return this.safeFetch(url, init, attempt + 1)
      }

      return response
    } catch (err: any) {
      clearTimeout(timeoutId)
      if (attempt <= this.maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 15000)
        this.log('warn', `Network error calling ${url}: ${err.message}. Retrying in ${Math.round(backoffMs)}ms...`)
        await new Promise((r) => setTimeout(r, backoffMs))
        return this.safeFetch(url, init, attempt + 1)
      }
      throw err
    }
  }

  /**
   * Execute authenticated JSON request
   */
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: any
  ): Promise<T> {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const fullUrl = `${this.apiBase}${cleanPath}`

    this.log('debug', `HTTP ${method} ${fullUrl}`)

    const headers: Record<string, string> = {
      'x-api-token': this.token,
      'Accept': 'application/json',
    }

    let requestBody: string | undefined
    if (body !== undefined && method !== 'GET') {
      headers['Content-Type'] = 'application/json'
      requestBody = JSON.stringify(body)
    }

    const response = await this.safeFetch(fullUrl, {
      method,
      headers,
      body: requestBody,
    })

    if (!response.ok) {
      let errPayload: any = {}
      try {
        errPayload = await response.json()
      } catch {
        errPayload = { message: await response.text() }
      }

      const errorMsg =
        errPayload.message ||
        (Array.isArray(errPayload.errors) ? errPayload.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ') : null) ||
        `HTTP Error ${response.status}: ${response.statusText}`

      throw new Error(`[ContentApi Error ${response.status}] ${errorMsg}`)
    }

    if (response.status === 204) {
      return undefined as unknown as T
    }

    return (await response.json()) as T
  }

  // -------------------------------------------------------------
  // Verification and Metadata Endpoints
  // -------------------------------------------------------------

  /**
   * Verify token permissions and API connectivity
   */
  async verifyConnection(): Promise<{
    authenticated: boolean
    postsRead: boolean
    categoriesCount: number
    tagsCount: number
  }> {
    this.log('info', `Testing connection to Content API at ${this.origin}...`)
    try {
      const postsRes = await this.request<PaginatedResponse<Post>>('GET', '/automation/posts?limit=1')
      const categories = await this.getCategories()
      const tags = await this.getTags()

      this.log('info', `Connection verified successfully. Posts count: ${postsRes.meta?.total ?? 'ok'}, Categories: ${categories.length}, Tags: ${tags.length}`)

      return {
        authenticated: true,
        postsRead: true,
        categoriesCount: categories.length,
        tagsCount: tags.length,
      }
    } catch (err: any) {
      this.log('error', `Connection test failed: ${err.message}`)
      throw err
    }
  }

  /**
   * Fetch all categories (public endpoint)
   */
  async getCategories(): Promise<Category[]> {
    const res = await this.request<SingleResponse<Category[]> | Category[]>('GET', '/categories')
    return Array.isArray(res) ? res : (res as SingleResponse<Category[]>).data
  }

  /**
   * Find category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await this.getCategories()
    const findInTree = (list: Category[]): Category | null => {
      for (const cat of list) {
        if (cat.slug === slug) return cat
        if (cat.children && cat.children.length > 0) {
          const found = findInTree(cat.children)
          if (found) return found
        }
      }
      return null
    }
    return findInTree(categories)
  }

  /**
   * Fetch all tags (public endpoint)
   */
  async getTags(query?: string): Promise<Tag[]> {
    const path = query ? `/tags?q=${encodeURIComponent(query)}&limit=100` : '/tags?limit=100'
    const res = await this.request<SingleResponse<Tag[]> | Tag[]>('GET', path)
    return Array.isArray(res) ? res : (res as SingleResponse<Tag[]>).data
  }

  // -------------------------------------------------------------
  // Post Operations (with Idempotency & Deduplication)
  // -------------------------------------------------------------

  /**
   * Query post by slug or numeric ID
   */
  async getPost(idOrSlug: string | number): Promise<Post | null> {
    try {
      const res = await this.request<SingleResponse<Post>>('GET', `/automation/posts/${idOrSlug}`)
      return res.data
    } catch (err: any) {
      if (err.message.includes('404') || err.message.includes('Row not found')) {
        return null
      }
      throw err
    }
  }

  /**
   * Find post by exact slug across existing posts
   */
  async findPostBySlug(slug: string): Promise<Post | null> {
    const cleanSlug = slug.toLowerCase().trim()
    const res = await this.request<PaginatedResponse<Post>>('GET', `/automation/posts?search=${encodeURIComponent(cleanSlug)}&limit=50`)
    const matches = res.data.filter((p) => p.slug.toLowerCase() === cleanSlug)
    return matches.length > 0 ? matches[0] : null
  }

  /**
   * Create or update draft post idempotently
   */
  async createDraftPost(
    payload: CreatePostPayload,
    options: { updateIfExists?: boolean; dryRun?: boolean } = {}
  ): Promise<{ post: Post; action: 'created' | 'updated' | 'dry-run' }> {
    const isDryRun = options.dryRun ?? this.dryRun

    // Validation checks
    if (!payload.title || payload.title.length < 3 || payload.title.length > 255) {
      throw new Error(`Invalid title length (${payload.title?.length ?? 0}). Must be between 3 and 255 characters.`)
    }
    if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
      throw new Error(`Invalid slug format: "${payload.slug}". Must match /^[a-z0-9-]+$/`)
    }
    if (!payload.content || payload.content.trim().length === 0) {
      throw new Error('Content is required and cannot be empty.')
    }

    // Force status to DRAFT for safe drafting
    const draftPayload: CreatePostPayload = {
      ...payload,
      status: 'DRAFT',
    }

    this.log('info', `Checking for duplicate slug: "${payload.slug}"...`)
    const existing = await this.findPostBySlug(payload.slug)

    if (existing) {
      this.log('warn', `Post with slug "${payload.slug}" already exists (ID: ${existing.id}, Status: ${existing.status}).`)

      if (!options.updateIfExists) {
        throw new Error(
          `Conflict: Post with slug "${payload.slug}" already exists (ID: ${existing.id}). ` +
            `Use updateIfExists=true or specify a unique slug to prevent duplicate posts.`
        )
      }

      if (isDryRun) {
        this.log('info', `[DRY-RUN] Would update existing post ID ${existing.id} with new draft payload.`)
        return { post: { ...existing, ...draftPayload }, action: 'dry-run' }
      }

      this.log('info', `Updating existing post ID ${existing.id} with draft updates...`)
      const updated = await this.request<SingleResponse<Post>>('PUT', `/automation/posts/${existing.id}`, draftPayload)
      return { post: updated.data, action: 'updated' }
    }

    if (isDryRun) {
      this.log('info', `[DRY-RUN] Validated draft payload for "${payload.title}" (slug: ${payload.slug}). Skipping network write.`)
      const mockPost: Post = {
        id: 999999,
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
        excerpt: payload.excerpt || null,
        metaTitle: payload.metaTitle || null,
        metaDescription: payload.metaDescription || null,
        focusKeyword: payload.focusKeyword || null,
        canonicalUrl: payload.canonicalUrl || null,
        coverImage: payload.coverImage || null,
        status: 'DRAFT',
        views: 0,
        categoryId: payload.categoryId || null,
        seriesId: payload.seriesId || null,
        publishedAt: null,
      }
      return { post: mockPost, action: 'dry-run' }
    }

    this.log('info', `Creating new draft post: "${payload.title}"...`)
    const created = await this.request<SingleResponse<Post>>('POST', '/automation/posts', draftPayload)
    this.log('info', `Draft post created successfully with ID: ${created.data.id}`)
    return { post: created.data, action: 'created' }
  }

  /**
   * Explicit publication stage. Requires confirmation!
   */
  async publishPost(
    id: number,
    options: { confirm: boolean; dryRun?: boolean; publishedAt?: string }
  ): Promise<Post> {
    if (!options.confirm) {
      throw new Error(
        'Safety guard: publishPost requires explicit confirmation ({ confirm: true }). ' +
          'Posts must remain DRAFT until human QA and user authorization are complete.'
      )
    }

    const isDryRun = options.dryRun ?? this.dryRun

    const existing = await this.getPost(id)
    if (!existing) {
      throw new Error(`Cannot publish: Post ID ${id} not found.`)
    }

    const publishedAt = options.publishedAt || new Date().toISOString()
    const payload: UpdatePostPayload = {
      status: 'PUBLISHED',
      publishedAt,
    }

    if (isDryRun) {
      this.log('info', `[DRY-RUN] Would publish post ID ${id} with publishedAt: ${publishedAt}`)
      return { ...existing, status: 'PUBLISHED', publishedAt }
    }

    this.log('info', `Publishing post ID ${id} (${existing.slug}) at ${publishedAt}...`)
    const updated = await this.request<SingleResponse<Post>>('PUT', `/automation/posts/${id}`, payload)
    this.log('info', `Post ID ${id} successfully published!`)
    return updated.data
  }

  // -------------------------------------------------------------
  // Media Upload Operations
  // -------------------------------------------------------------

  /**
   * Upload image to CDN via API gateway
   * @param localFilePath Path to local image file (e.g. .webp, .png)
   * @param folder Folder on CDN (e.g. "blog/help-desk/20261021")
   */
  async uploadMediaFile(
    localFilePath: string,
    folder: string = 'Posts'
  ): Promise<MediaUploadResponse['data']> {
    if (this.dryRun) {
      const fileName = basename(localFilePath)
      const fakePath = `${folder}/${fileName}`
      this.log('info', `[DRY-RUN] Would upload ${localFilePath} to folder "${folder}"`)
      return {
        original_name: fileName,
        file_name: fileName,
        path: fakePath,
        url: `https://cdn.thanhnh.id.vn/medias/${fakePath}`,
        size: 10240,
        mime_type: 'image/webp',
      }
    }

    const fileBuffer = await readFile(localFilePath)
    const fileName = basename(localFilePath)
    const ext = fileName.split('.').pop()?.toLowerCase() || 'webp'
    const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/webp'

    const boundary = `ContentBoundary${Math.random().toString(16).slice(2)}`
    const crlf = '\r\n'

    // Build multipart/form-data payload manually for zero-dep compatibility
    const headerPart = Buffer.from(
      `--${boundary}${crlf}` +
        `Content-Disposition: form-data; name="folder"${crlf}${crlf}` +
        `${folder}${crlf}` +
        `--${boundary}${crlf}` +
        `Content-Disposition: form-data; name="file"; filename="${fileName}"${crlf}` +
        `Content-Type: ${mimeType}${crlf}${crlf}`
    )
    const footerPart = Buffer.from(`${crlf}--${boundary}--${crlf}`)
    const fullBody = Buffer.concat([headerPart, fileBuffer, footerPart])

    const url = `${this.apiBase}/automation/media/upload`
    this.log('info', `Uploading media file ${fileName} (${fileBuffer.length} bytes) to ${folder}...`)

    const response = await this.safeFetch(url, {
      method: 'POST',
      headers: {
        'x-api-token': this.token,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Accept': 'application/json',
      },
      body: fullBody,
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Media upload failed (HTTP ${response.status}): ${errText}`)
    }

    const result = (await response.json()) as MediaUploadResponse
    this.log('info', `Media uploaded successfully: path="${result.data.path}", url="${result.data.url}"`)
    return result.data
  }
}
