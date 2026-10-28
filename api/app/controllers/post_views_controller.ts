import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Post from '#models/post'
import env from '#start/env'
import { isAutomatedView, viewDetails, viewerIp } from '#services/post_view_details'

export default class PostViewsController {
  async store({ params, request, response }: HttpContext) {
    const userAgent = request.header('user-agent') || ''
    if (isAutomatedView(userAgent)) return response.noContent()
    const ip = viewerIp(
      request.request.socket.remoteAddress || '',
      request.ip(),
      request.header('x-forwarded-for') || request.header('x-real-ip'),
      env.get('POST_VIEWS_TRUSTED_PROXY_IPS') || ''
    )
    const details = viewDetails(ip, userAgent, request.input('referrer'))
    await db.transaction(async (trx) => {
      // Serialize writes per post so retries and simultaneous requests cannot double-count.
      const post = await Post.query({ client: trx })
        .where('id', params.id)
        .where('status', 'PUBLISHED')
        .whereNull('deleted_at')
        .forUpdate()
        .firstOrFail()
      const existing = await trx
        .from('post_views')
        .where('post_id', post.id)
        .where('visitor_key', details.visitor_key)
        .first()
      if (existing) return
      await trx.table('post_views').insert({ post_id: post.id, ...details, created_at: new Date() })
      await trx.from('posts').where('id', post.id).increment('views', 1)
    })
    return response.noContent()
  }

  async index({ params, request, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const page = Math.max(1, Math.min(100000, Number.parseInt(request.input('page', '1'), 10) || 1))
    const limit = 25
    const rows = await db
      .from('post_views')
      .where('post_id', post.id)
      .select(
        'id',
        'ip',
        'country',
        'region',
        'city',
        'browser',
        'os',
        'device',
        'referrer',
        'created_at'
      )
      .orderBy('created_at', 'desc')
      .orderBy('id', 'desc')
      .paginate(page, limit)
    response.header('Cache-Control', 'private, no-store')
    return response.ok({ ...rows.toJSON(), totalViews: post.views })
  }
}
