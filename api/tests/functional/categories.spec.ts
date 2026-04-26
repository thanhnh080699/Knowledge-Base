import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Category from '#models/category'

test.group('Categories', () => {
  async function createAdminUser() {
    const admin = await User.firstOrCreate(
      { email: `admin-categories-${Date.now()}@example.com` },
      {
        fullName: 'Categories Admin',
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
      { slug: 'categories.manage' },
      {
        name: 'Manage Categories',
        module: 'categories',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return admin
  }

  test('create list update and delete categories as admin', async ({ client, assert }) => {
    const admin = await createAdminUser()
    const slug = `category-${Date.now()}`

    const createResponse = await client.post('/api/admin/categories').loginAs(admin).json({
      name: 'Functional Category',
      slug,
      description: 'Category for functional tests',
      icon: 'FolderOpen',
      color: '#2563eb',
    })

    createResponse.assertStatus(201)
    const createdBody = createResponse.body() as unknown as { data: { slug: string } }
    assert.equal(createdBody.data.slug, slug)

    const listResponse = await client.get('/api/categories').qs({ q: slug })
    listResponse.assertStatus(200)
    const listBody = listResponse.body() as unknown as { data: Array<{ slug: string }> }
    assert.isTrue(listBody.data.some((category) => category.slug === slug))

    const category = await Category.findByOrFail('slug', slug)
    const updateResponse = await client
      .put(`/api/admin/categories/${category.id}`)
      .loginAs(admin)
      .json({ name: 'Updated Functional Category' })

    updateResponse.assertStatus(200)
    const updatedBody = updateResponse.body() as unknown as { data: { name: string } }
    assert.equal(updatedBody.data.name, 'Updated Functional Category')

    const deleteResponse = await client
      .delete(`/api/admin/categories/${category.id}`)
      .loginAs(admin)
    deleteResponse.assertStatus(204)
  })

  test('reject category create without permission', async ({ client }) => {
    const user = await User.create({
      fullName: 'Category Limited User',
      email: `category-limited-${Date.now()}@example.com`,
      password: 'password123',
    })

    const response = await client
      .post('/api/admin/categories')
      .loginAs(user)
      .json({
        name: 'Forbidden Category',
        slug: `forbidden-category-${Date.now()}`,
      })

    response.assertStatus(403)
  })
})
