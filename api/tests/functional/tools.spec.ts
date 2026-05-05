import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Tool from '#models/tool'

test.group('Tools', (group) => {
  let admin: User

  group.setup(async () => {
    admin = await User.firstOrCreate(
      { email: 'tools-admin@example.com' },
      {
        fullName: 'Tools Admin',
        password: 'password123',
      }
    )

    const adminRole = await Role.firstOrCreate(
      { slug: 'admin' },
      {
        name: 'Administrator',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'tools.manage' },
      {
        name: 'Manage Tools',
        module: 'Tools',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])
  })

  test('create list show update and delete tool as admin', async ({ client, assert }) => {
    const slug = `tool-${Date.now()}`

    const createResponse = await client.post('/api/admin/tools').loginAs(admin).json({
      name: 'Base64 Encoder',
      slug,
      description: 'Encode text to Base64',
      category: 'Encoder',
      icon: 'base64-icon',
      urlPath: '/tools/base64-encoder',
      featured: true,
      status: 'PUBLISHED',
      sortOrder: 1,
    })

    createResponse.assertStatus(201)
    const createdBody = createResponse.body() as unknown as {
      data: { slug: string; status: string }
    }
    assert.equal(createdBody.data.slug, slug)
    assert.equal(createdBody.data.status, 'PUBLISHED')

    const listResponse = await client.get('/api/tools').qs({ q: slug })
    listResponse.assertStatus(200)
    const listBody = listResponse.body() as unknown as {
      data: Array<{ slug: string }>
      meta: { total: number }
    }
    assert.isAbove(listBody.meta.total, 0)
    assert.isTrue(listBody.data.some((tool) => tool.slug === slug))

    const showResponse = await client.get(`/api/tools/${slug}`)
    showResponse.assertStatus(200)
    const showBody = showResponse.body() as unknown as { data: { slug: string } }
    assert.equal(showBody.data.slug, slug)

    const tool = await Tool.findByOrFail('slug', slug)
    const updateResponse = await client
      .put(`/api/admin/tools/${tool.id}`)
      .loginAs(admin)
      .json({ description: 'Updated description', status: 'ARCHIVED' })

    updateResponse.assertStatus(200)
    const updateBody = updateResponse.body() as unknown as {
      data: { description: string; status: string }
    }
    assert.equal(updateBody.data.description, 'Updated description')
    assert.equal(updateBody.data.status, 'ARCHIVED')

    const hiddenResponse = await client.get(`/api/tools/${slug}`)
    hiddenResponse.assertStatus(404)

    const deleteResponse = await client.delete(`/api/admin/tools/${tool.id}`).loginAs(admin)
    deleteResponse.assertStatus(204)
  })

  test('reject tool create without permission', async ({ client }) => {
    const user = await User.create({
      fullName: 'Tool Limited User',
      email: `tool-limited-${Date.now()}@example.com`,
      password: 'password123',
    })

    const response = await client.post('/api/admin/tools').loginAs(user).json({
      name: 'Forbidden Tool',
      slug: `forbidden-tool-${Date.now()}`,
      description: 'Should not be created',
      category: 'Test',
      urlPath: '/tools/forbidden',
    })

    response.assertStatus(403)
  })
})
