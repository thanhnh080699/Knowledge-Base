import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Comment, { type CommentStatus } from '#models/comment'
import Post from '#models/post'
import {
  adminCommentStatusValidator,
  adminReplyCommentValidator,
  createPublicCommentValidator,
} from '#validators/comment'

export default class CommentsController {
  /**
   * @publicForPost
   * @description Display approved comments and replies for a public post
   * @tag COMMENTS
   * @paramPath postId - Post ID or slug - example: "my-post"
   * @responseBody 200 - { data: <Comment[]> }
   */
  async publicForPost({ params, response }: HttpContext) {
    const post = await Post.query()
      .where((builder) => {
        builder.where('id', params.postId).orWhere('slug', params.postId)
      })
      .whereNull('deleted_at')
      .firstOrFail()

    const comments = await Comment.query()
      .where('postId', post.id)
      .whereNull('parentId')
      .where('status', 'APPROVED')
      .whereNull('deleted_at')
      .preload('replies', (replyQuery) => {
        replyQuery.where('status', 'APPROVED').whereNull('deleted_at').orderBy('createdAt', 'asc')
      })
      .orderBy('createdAt', 'asc')

    return response.ok({ data: comments })
  }

  /**
   * @storePublic
   * @description Create a pending public comment or reply for a post
   * @tag COMMENTS
   * @paramPath postId - Post ID or slug - example: "my-post"
   * @requestBody <Comment>
   * @responseBody 201 - { data: <Comment> }
   */
  async storePublic({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createPublicCommentValidator)
    const post = await Post.query()
      .where((builder) => {
        builder.where('id', params.postId).orWhere('slug', params.postId)
      })
      .whereNull('deleted_at')
      .firstOrFail()

    if (payload.parentId) {
      const parent = await Comment.query()
        .where('id', payload.parentId)
        .where('postId', post.id)
        .whereNull('deleted_at')
        .first()

      if (!parent) {
        return response.badRequest({ message: 'Parent comment does not belong to this post' })
      }
    }

    const comment = await Comment.create({
      postId: post.id,
      parentId: payload.parentId ?? null,
      authorName: payload.authorName,
      authorEmail: payload.authorEmail,
      authorWebsite: payload.authorWebsite ?? null,
      content: payload.content,
      status: 'PENDING',
      ipAddress: request.ip(),
      userAgent: request.header('user-agent') ?? null,
    })

    return response.created({ data: comment })
  }

  /**
   * @index
   * @description Display comments for admin moderation
   * @tag COMMENTS
   * @paramQuery status - Filter by status - example: PENDING
   * @paramQuery postId - Filter by post ID - example: 1
   * @paramQuery search - Search content or author - example: john
   * @responseBody 200 - <Comment[]>.paginate
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const status = request.input('status') as CommentStatus | undefined
    const postId = request.input('postId')
    const search = request.input('search') || request.input('q')
    const trashed = request.input('trashed')

    const query = Comment.query()
      .preload('post')
      .preload('parent')
      .preload('replies', (replyQuery) => {
        replyQuery.whereNull('deleted_at').orderBy('createdAt', 'asc')
      })
      .orderBy('createdAt', 'desc')

    if (trashed === true || trashed === 'true' || trashed === '1') {
      query.whereNotNull('deleted_at')
    } else {
      query.whereNull('deleted_at')
    }

    if (status) {
      query.where('status', status)
    }

    if (postId) {
      query.where('postId', postId)
    }

    if (search) {
      query.where((builder) => {
        builder
          .where('authorName', 'like', `%${search}%`)
          .orWhere('authorEmail', 'like', `%${search}%`)
          .orWhere('content', 'like', `%${search}%`)
      })
    }

    const comments = await query.paginate(page, limit)
    return response.ok(comments)
  }

  /**
   * @updateStatus
   * @description Update comment moderation status
   * @tag COMMENTS
   * @paramPath id - Comment ID - example: 1
   * @requestBody { status: "APPROVED" }
   * @responseBody 200 - { data: <Comment> }
   */
  async updateStatus({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(adminCommentStatusValidator)
    const comment = await Comment.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()

    comment.status = payload.status
    comment.approvedAt = payload.status === 'APPROVED' ? DateTime.utc() : null
    await comment.save()
    await comment.load('post')
    await comment.load('parent')

    return response.ok({ data: comment })
  }

  /**
   * @reply
   * @description Create an admin reply to a comment
   * @tag COMMENTS
   * @paramPath id - Parent comment ID - example: 1
   * @requestBody <Comment>
   * @responseBody 201 - { data: <Comment> }
   */
  async reply({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(adminReplyCommentValidator)
    const parent = await Comment.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()
    const status = payload.status ?? 'APPROVED'

    const reply = await Comment.create({
      postId: parent.postId,
      parentId: parent.id,
      authorName: payload.authorName ?? 'Thanh Nguyen',
      authorEmail: payload.authorEmail ?? 'admin@thanhnh.id.vn',
      authorWebsite: payload.authorWebsite ?? null,
      content: payload.content,
      status,
      approvedAt: status === 'APPROVED' ? DateTime.utc() : null,
      ipAddress: request.ip(),
      userAgent: request.header('user-agent') ?? null,
    })

    await reply.load('post')
    await reply.load('parent')

    return response.created({ data: reply })
  }

  /**
   * @destroy
   * @description Soft delete a comment
   * @tag COMMENTS
   * @paramPath id - Comment ID - example: 1
   * @responseBody 204 - No content
   */
  async destroy({ params, response }: HttpContext) {
    const comment = await Comment.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .firstOrFail()
    comment.deletedAt = DateTime.utc()
    await comment.save()

    return response.noContent()
  }
}
