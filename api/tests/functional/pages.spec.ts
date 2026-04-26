import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Page from '#models/page'

test.group('Pages', () => {
  async function createAdminUser() {
    const admin = await User.firstOrCreate(
      { email: `admin-pages-${Date.now()}@example.com` },
      {
        fullName: 'Pages Admin',
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
      { slug: 'pages.manage' },
      {
        name: 'Manage Pages',
        module: 'Pages',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return admin
  }

  test('create list update set homepage and soft delete pages as admin', async ({
    client,
    assert,
  }) => {
    const admin = await createAdminUser()
    const slug = `page-${Date.now()}`

    const createResponse = await client.post('/api/admin/pages').loginAs(admin).json({
      title: 'About Us',
      slug,
      content: 'About us page content',
      status: 'PUBLISHED',
      isHomepage: true,
      publishedAt: new Date().toISOString(),
    })

    createResponse.assertStatus(201)
    const createdBody = createResponse.body() as unknown as {
      data: { slug: string; isHomepage: boolean }
    }
    assert.equal(createdBody.data.slug, slug)
    assert.isTrue(createdBody.data.isHomepage)

    const homepageResponse = await client.get('/api/pages/homepage')
    homepageResponse.assertStatus(200)
    assert.equal(homepageResponse.body().data.slug, slug)

    const page = await Page.findByOrFail('slug', slug)
    const updateResponse = await client
      .put(`/api/admin/pages/${page.id}`)
      .loginAs(admin)
      .json({ title: 'About Thanh Nguyen', isHomepage: false })

    updateResponse.assertStatus(200)
    assert.equal(updateResponse.body().data.title, 'About Thanh Nguyen')
    assert.isFalse(updateResponse.body().data.isHomepage)

    const setHomepageResponse = await client
      .post(`/api/admin/pages/${page.id}/homepage`)
      .loginAs(admin)
    setHomepageResponse.assertStatus(200)
    assert.isTrue(setHomepageResponse.body().data.isHomepage)

    const deleteResponse = await client.delete(`/api/admin/pages/${page.id}`).loginAs(admin)
    deleteResponse.assertStatus(204)

    const restoreResponse = await client.post(`/api/admin/pages/${page.id}/restore`).loginAs(admin)
    restoreResponse.assertStatus(200)
  })

  test('reject page create without permission', async ({ client }) => {
    const user = await User.create({
      fullName: 'Page Limited User',
      email: `page-limited-${Date.now()}@example.com`,
      password: 'password123',
    })

    const response = await client
      .post('/api/admin/pages')
      .loginAs(user)
      .json({
        title: 'Forbidden Page',
        slug: `forbidden-page-${Date.now()}`,
        content: 'Forbidden',
      })

    response.assertStatus(403)
  })
})
