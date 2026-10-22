import { test } from '@japa/runner'
import ApiAccessToken from '#models/api_access_token'
import Category from '#models/category'
import Permission from '#models/permission'
import Post from '#models/post'
import Role from '#models/role'
import User from '#models/user'

test.group('API access tokens', () => {
  async function createTokenAdmin() {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const admin = await User.create({
      fullName: 'API Token Admin',
      email: `api-token-admin-${Date.now()}@example.com`,
      password: 'password123',
    })

    const role = await Role.firstOrCreate(
      { slug: `api-token-admin-${suffix}` },
      { name: `API Token Administrator ${suffix}` }
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

  test('create permission allows all selected scopes without manage permission', async ({ client, assert }) => {
    const { admin } = await createTokenAdmin()
    await admin.load('roles')
    const createPermission = await Permission.firstOrCreate(
      { slug: 'api_tokens.create' },
      { name: 'Create API Tokens', module: 'API Tokens' }
    )
    await admin.roles[0].related('permissions').sync([createPermission.id])
    const permissions = await Permission.query().whereNull('deleted_at')
    const scopes = permissions.map((permission) => permission.slug)

    const response = await client.post('/api/admin/api-access-tokens').loginAs(admin).json({
      name: 'All selected permissions', expiresIn: '1_month', permissions: scopes,
    })
    response.assertStatus(201)
    assert.deepEqual(response.body().data.item.permissions, scopes)

    const denied = await client.delete(`/api/admin/api-access-tokens/${response.body().data.item.id}`).loginAs(admin)
    denied.assertStatus(403)
  })

  test('content permissions alone cannot create API tokens', async ({ client }) => {
    const { admin, readPosts } = await createTokenAdmin()
    await admin.load('roles')
    await admin.roles[0].related('permissions').sync([readPosts.id])
    const response = await client.post('/api/admin/api-access-tokens').loginAs(admin).json({
      name: 'Unauthorized token', expiresIn: '1_month', permissions: [readPosts.slug],
    })
    response.assertStatus(403)
  })

  test('backfilled media scopes can be selected and authorize uploads without granting other tokens access', async ({ client, assert }) => {
    const { admin, readPosts } = await createTokenAdmin()
    const media = await Permission.query().where('module', 'Media').whereNull('deleted_at')
    assert.sameMembers(media.map((permission) => permission.slug), [
      'media.create', 'media.read', 'media.update', 'media.delete', 'media.manage',
    ])

    const response = await client.post('/api/admin/api-access-tokens').loginAs(admin).json({
      name: 'Content with media', expiresIn: '1_week',
      permissions: [readPosts.slug, ...media.map((permission) => permission.slug)],
    })
    response.assertStatus(201)
    assert.include(response.body().data.item.permissions, 'media.create')

    // No file is supplied: reaching the upload validator proves the token guard
    // accepts media.create without contacting the production CDN.
    const upload = await client.post('/api/automation/media/upload')
      .header('x-api-token', response.body().data.token)
    upload.assertStatus(400)
    assert.equal(upload.body().error, 'file is required')

    const readOnly = await ApiAccessToken.create({ name: 'Posts only', permissions: [readPosts.slug] })
    const denied = await client.post('/api/automation/media/upload')
      .header('x-api-token', readOnly.plainToken!)
    denied.assertStatus(403)
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
