import { test } from '@japa/runner'
import ApiAccessToken from '#models/api_access_token'
import Category from '#models/category'
import Permission from '#models/permission'
import Post from '#models/post'
import Role from '#models/role'
import User from '#models/user'

test.group('API access tokens', () => {
  async function createTokenAdmin() {
    const admin = await User.create({
      fullName: 'API Token Admin',
      email: `api-token-admin-${Date.now()}@example.com`,
      password: 'password123',
    })

    const role = await Role.firstOrCreate(
      { slug: `api-token-admin-${Date.now()}` },
      { name: 'API Token Administrator' }
    )

    const manageTokens = await Permission.firstOrCreate(
      { slug: 'api_tokens.manage' },
      { name: 'Manage API Tokens', module: 'API Tokens' }
    )
    const readPosts = await Permission.firstOrCreate(
      { slug: 'posts.read' },
      { name: 'Read Posts', module: 'Posts' }
    )
    const createPosts = await Permission.firstOrCreate(
      { slug: 'posts.create' },
      { name: 'Create Posts', module: 'Posts' }
    )

    await role.related('permissions').sync([manageTokens.id])
    await admin.related('roles').sync([role.id])

    return { admin, readPosts, createPosts }
  }

  test('create list update and soft delete API access tokens', async ({ client, assert }) => {
    const { admin, readPosts, createPosts } = await createTokenAdmin()

    const createResponse = await client
      .post('/api/admin/api-access-tokens')
      .loginAs(admin)
      .json({
        name: 'Marketing automation',
        expiresIn: '1_month',
        permissions: [readPosts.slug, createPosts.slug],
      })

    createResponse.assertStatus(201)
    const created = createResponse.body().data as {
      token: string
      item: { id: number; permissions: string[]; expiresAt: string | null }
    }
    assert.match(created.token, /^thn_/)
    assert.deepEqual(created.item.permissions, [readPosts.slug, createPosts.slug])
    assert.isString(created.item.expiresAt)

    const listResponse = await client.get('/api/admin/api-access-tokens').loginAs(admin)
    listResponse.assertStatus(200)
    assert.isTrue(
      (listResponse.body().data as Array<{ id: number }>).some((item) => item.id === created.item.id)
    )

    const updateResponse = await client
      .put(`/api/admin/api-access-tokens/${created.item.id}`)
      .loginAs(admin)
      .json({ name: 'Content bot', expiresIn: 'no_expire', permissions: [readPosts.slug] })
    updateResponse.assertStatus(200)
    assert.equal(updateResponse.body().data.name, 'Content bot')
    assert.isNull(updateResponse.body().data.expiresAt)

    const destroyResponse = await client
      .delete(`/api/admin/api-access-tokens/${created.item.id}`)
      .loginAs(admin)
    destroyResponse.assertStatus(204)

    const stored = await ApiAccessToken.findOrFail(created.item.id)
    assert.isNotNull(stored.deletedAt)
  })

  test('uses API token permissions for automation content routes', async ({ client, assert }) => {
    const { admin, createPosts } = await createTokenAdmin()
    const category = await Category.firstOrCreate(
      { slug: 'automation-token-content' },
      { name: 'Automation Token Content' }
    )
    const slug = `automation-token-post-${Date.now()}`

    const createTokenResponse = await client
      .post('/api/admin/api-access-tokens')
      .loginAs(admin)
      .json({
        name: 'Content automation',
        expiresIn: '1_week',
        permissions: [createPosts.slug],
      })
    const plainToken = createTokenResponse.body().data.token as string

    const postResponse = await client
      .post('/api/automation/posts')
      .header('x-api-token', plainToken)
      .json({
        title: 'Automation Token Post',
        slug,
        content: 'Created through API token automation route',
        categoryId: category.id,
        status: 'DRAFT',
      })

    postResponse.assertStatus(201)
    assert.equal(postResponse.body().data.slug, slug)

    const post = await Post.findByOrFail('slug', slug)
    assert.equal(post.title, 'Automation Token Post')
  })
})
