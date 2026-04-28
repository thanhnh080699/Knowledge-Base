import { test } from '@japa/runner'
import Category from '#models/category'
import Comment from '#models/comment'
import Permission from '#models/permission'
import Post from '#models/post'
import Role from '#models/role'
import User from '#models/user'

interface CommentPayload {
  id: number
  postId: number
  parentId: number | null
  status: string
  approvedAt: string | null
  replies?: CommentPayload[]
}

interface CommentListPayload {
  data: CommentPayload[]
}

interface CommentItemPayload {
  data: CommentPayload
}

test.group('Comments', (group) => {
  let admin: User
  let post: Post

  group.setup(async () => {
    admin =
      (await User.query().where('email', 'comments-admin@example.com').first()) ??
      (await User.create({
        fullName: 'Comments Admin',
        email: 'comments-admin@example.com',
        password: 'password123',
      }))

    const adminRole = await Role.firstOrCreate(
      { slug: 'comments-admin' },
      {
        name: 'Comments Administrator',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'comments.manage' },
      {
        name: 'Manage Comments',
        module: 'Comments',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    const category = await Category.firstOrCreate(
      { slug: 'comments-test' },
      {
        name: 'Comments Test',
      }
    )

    await Post.query().where('slug', 'comments-post').delete()
    post = await Post.create({
      title: 'Comments Post',
      slug: 'comments-post',
      content: 'Post content for comments',
      status: 'PUBLISHED',
      categoryId: category.id,
    })
  })

  group.each.setup(async () => {
    await Comment.query().where('postId', post.id).delete()
  })

  test('public user can submit a pending comment', async ({ client, assert }) => {
    const response = await client.post(`/api/posts/${post.slug}/comments`).json({
      authorName: 'Public Reader',
      authorEmail: 'reader@example.com',
      content: 'Thanks for the article',
    })
    const body = response.body() as CommentItemPayload

    response.assertStatus(201)
    assert.equal(body.data.postId, post.id)
    assert.equal(body.data.status, 'PENDING')
  })

  test('public listing returns approved comments with approved replies only', async ({
    client,
    assert,
  }) => {
    const comment = await Comment.create({
      postId: post.id,
      authorName: 'Approved Reader',
      authorEmail: 'approved@example.com',
      content: 'Approved comment',
      status: 'APPROVED',
    })

    await Comment.create({
      postId: post.id,
      parentId: comment.id,
      authorName: 'Approved Reply',
      authorEmail: 'reply@example.com',
      content: 'Approved reply',
      status: 'APPROVED',
    })

    await Comment.create({
      postId: post.id,
      parentId: comment.id,
      authorName: 'Pending Reply',
      authorEmail: 'pending@example.com',
      content: 'Pending reply',
      status: 'PENDING',
    })

    const response = await client.get(`/api/posts/${post.slug}/comments`)
    const body = response.body() as CommentListPayload

    response.assertStatus(200)
    assert.lengthOf(body.data, 1)
    assert.lengthOf(body.data[0].replies ?? [], 1)
  })

  test('admin can approve a comment and reply', async ({ client, assert }) => {
    const comment = await Comment.create({
      postId: post.id,
      authorName: 'Needs Approval',
      authorEmail: 'pending@example.com',
      content: 'Pending comment',
      status: 'PENDING',
    })

    const approveResponse = await client
      .patch(`/api/admin/comments/${comment.id}/status`)
      .loginAs(admin)
      .json({ status: 'APPROVED' })
    const approveBody = approveResponse.body() as CommentItemPayload

    approveResponse.assertStatus(200)
    assert.equal(approveBody.data.status, 'APPROVED')
    assert.isNotNull(approveBody.data.approvedAt)

    const replyResponse = await client
      .post(`/api/admin/comments/${comment.id}/reply`)
      .loginAs(admin)
      .json({ content: 'Thanks for reading' })
    const replyBody = replyResponse.body() as CommentItemPayload

    replyResponse.assertStatus(201)
    assert.equal(replyBody.data.parentId, comment.id)
    assert.equal(replyBody.data.status, 'APPROVED')
  })

  test('admin can list and soft delete comments', async ({ client, assert }) => {
    const comment = await Comment.create({
      postId: post.id,
      authorName: 'Delete Me',
      authorEmail: 'delete@example.com',
      content: 'Delete comment',
      status: 'PENDING',
    })

    const listResponse = await client.get('/api/admin/comments').loginAs(admin)
    const listBody = listResponse.body() as CommentListPayload

    listResponse.assertStatus(200)
    assert.isAtLeast(listBody.data.length, 1)

    const deleteResponse = await client.delete(`/api/admin/comments/${comment.id}`).loginAs(admin)
    deleteResponse.assertStatus(204)

    await comment.refresh()
    assert.isNotNull(comment.deletedAt)
  })
})
