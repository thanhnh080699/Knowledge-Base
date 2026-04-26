import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Post from '#models/post'
import Permission from '#models/permission'

test.group('Posts', (group) => {
  let admin: User

  group.setup(async () => {
    // Ensure admin user exists
    const existingAdmin = await User.query().where('email', 'admin-test@example.com').first()
    if (!existingAdmin) {
      admin = await User.create({
        fullName: 'Admin Test',
        email: 'admin-test@example.com',
        password: 'password123',
      })
    } else {
      admin = existingAdmin
    }

    // Ensure Admin role and permissions exist
    const adminRole = await Role.firstOrCreate(
      { slug: 'admin' },
      {
        name: 'Administrator',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'posts.manage' },
      {
        name: 'Manage Posts',
        module: 'posts',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])
  })

  test('create a new post as admin', async ({ client, assert }) => {
    // Cleanup previous test data
    await Post.query().where('slug', 'test-post-functional').delete()

    const payload = {
      title: 'Test Post Functional',
      slug: 'test-post-functional',
      content: 'This is a test post content',
      excerpt: 'Imported excerpt',
      metaTitle: 'SEO title',
      metaDescription: 'SEO description',
      focusKeyword: 'adonis wordpress migration',
      wordpressId: 987654,
      views: 12,
      publishedAt: '2026-04-26T08:30:00.000Z',
      status: 'PUBLISHED' as const,
    }

    const response = await client.post('/api/admin/posts').loginAs(admin).json(payload)
    const createdPost = (response.body() as { data: { title: string; wordpressId: number; views: number } })
      .data

    response.assertStatus(201)
    assert.equal(createdPost.title, payload.title)
    assert.equal(createdPost.wordpressId, payload.wordpressId)
    assert.equal(createdPost.views, payload.views)
  })

  test('cannot create post without permission', async ({ client }) => {
    const user = await User.create({
      fullName: 'Normal User',
      email: `user-${Date.now()}@example.com`,
      password: 'password123',
    })

    const response = await client.post('/api/admin/posts').loginAs(user).json({ title: 'Fail' })

    response.assertStatus(403)
  })

  test('list posts for public', async ({ client, assert }) => {
    const response = await client.get('/api/posts')
    const body = response.body() as { data?: unknown[] }

    response.assertStatus(200)
    assert.isArray(body.data ?? [])
  })

  test('show post for public', async ({ client, assert }) => {
    const response = await client.get('/api/posts/test-post-functional')
    response.assertStatus(200)
    assert.equal(response.body().data.slug, 'test-post-functional')
  })

  test('update post as admin', async ({ client, assert }) => {
    const post = await Post.findByOrFail('slug', 'test-post-functional')

    const response = await client
      .put(`/api/admin/posts/${post.id}`)
      .loginAs(admin)
      .json({ title: 'Updated Title' })

    response.assertStatus(200)
    assert.equal(response.body().data.title, 'Updated Title')
  })

  test('delete post as admin', async ({ client }) => {
    const post = await Post.findByOrFail('slug', 'test-post-functional')

    const response = await client.delete(`/api/admin/posts/${post.id}`).loginAs(admin)

    response.assertStatus(204)
  })

  test('restore and force delete post as admin', async ({ client, assert }) => {
    const post = await Post.query().where('slug', 'test-post-functional').whereNotNull('deleted_at').firstOrFail()

    const restoreResponse = await client.post(`/api/admin/posts/${post.id}/restore`).loginAs(admin)
    restoreResponse.assertStatus(200)
    assert.isNull(restoreResponse.body().data.deletedAt)

    const deleteResponse = await client.delete(`/api/admin/posts/${post.id}`).loginAs(admin)
    deleteResponse.assertStatus(204)

    const forceDeleteResponse = await client.delete(`/api/admin/posts/${post.id}/force`).loginAs(admin)
    forceDeleteResponse.assertStatus(204)
  })
})
