import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Tag from '#models/tag'

test.group('Tags', () => {
  async function createAdminUser() {
    const admin = await User.firstOrCreate(
      { email: `admin-tags-${Date.now()}@example.com` },
      {
        fullName: 'Tags Admin',
        password: 'password123',
      }
    )

    const adminRole = await Role.firstOrCreate(
      { slug: 'admin' },
      {
        name: 'Administrator',
        description: 'Full access to all modules',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'tags.manage' },
      {
        name: 'Manage Tags',
        module: 'tags',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return admin
  }

  test('create list update and delete tags as admin', async ({ client, assert }) => {
    const admin = await createAdminUser()
    const slug = `tag-${Date.now()}`

    const createResponse = await client.post('/api/admin/tags').loginAs(admin).json({
      name: 'Functional Tag',
      slug,
    })

    createResponse.assertStatus(201)
    const createdBody = createResponse.body() as unknown as { data: { slug: string } }
    assert.equal(createdBody.data.slug, slug)

    const listResponse = await client.get('/api/tags').qs({ q: slug })
    listResponse.assertStatus(200)
    const listBody = listResponse.body() as unknown as { data: Array<{ slug: string }> }
    assert.isTrue(listBody.data.some((tag) => tag.slug === slug))

    const tag = await Tag.findByOrFail('slug', slug)
    const updateResponse = await client
      .put(`/api/admin/tags/${tag.id}`)
      .loginAs(admin)
      .json({ name: 'Updated Functional Tag' })

    updateResponse.assertStatus(200)
    const updatedBody = updateResponse.body() as unknown as { data: { name: string } }
    assert.equal(updatedBody.data.name, 'Updated Functional Tag')

    const deleteResponse = await client.delete(`/api/admin/tags/${tag.id}`).loginAs(admin)
    deleteResponse.assertStatus(204)
  })

  test('reject tag create without permission', async ({ client }) => {
    const user = await User.create({
      fullName: 'Tag Limited User',
      email: `tag-limited-${Date.now()}@example.com`,
      password: 'password123',
    })

    const response = await client
      .post('/api/admin/tags')
      .loginAs(user)
      .json({
        name: 'Forbidden Tag',
        slug: `forbidden-tag-${Date.now()}`,
      })

    response.assertStatus(403)
  })
})
