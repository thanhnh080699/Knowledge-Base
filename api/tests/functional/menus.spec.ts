import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Menu from '#models/menu'

test.group('Menus', () => {
  async function createAdminUser() {
    const admin = await User.firstOrCreate(
      { email: `admin-menus-${Date.now()}@example.com` },
      {
        fullName: 'Menus Admin',
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
      { slug: 'menus.manage' },
      {
        name: 'Manage Menus',
        module: 'Menus',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return admin
  }

  test('create menu with nested items and set default', async ({ client, assert }) => {
    const admin = await createAdminUser()
    const slug = `main-menu-${Date.now()}`

    const createResponse = await client
      .post('/api/admin/menus')
      .loginAs(admin)
      .json({
        name: 'Main Menu',
        slug,
        location: 'header',
        isDefault: true,
        items: [
          { id: -1, title: 'Home', url: '/', sortOrder: 0 },
          { id: -2, parentId: -1, title: 'About', url: '/about', sortOrder: 0 },
        ],
      })

    createResponse.assertStatus(201)
    const created = (
      createResponse.body() as unknown as {
        data: { isDefault: boolean; items: Array<{ title: string; parentId: number | null }> }
      }
    ).data
    assert.isTrue(created.isDefault)
    assert.lengthOf(created.items, 2)
    assert.isNotNull(
      created.items.find((item: { title: string }) => item.title === 'About')?.parentId
    )

    const menu = await Menu.findByOrFail('slug', slug)
    const syncResponse = await client
      .put(`/api/admin/menus/${menu.id}/items`)
      .loginAs(admin)
      .json({
        items: [
          { id: -1, title: 'Home', url: '/', sortOrder: 0 },
          { id: -2, title: 'Contact', url: '/contact', sortOrder: 1 },
        ],
      })

    syncResponse.assertStatus(200)
    const synced = (syncResponse.body() as unknown as { data: { items: unknown[] } }).data
    assert.lengthOf(synced.items, 2)

    const defaultResponse = await client.get('/api/menus/default')
    defaultResponse.assertStatus(200)
    assert.equal(defaultResponse.body().data.slug, slug)

    const deleteResponse = await client.delete(`/api/admin/menus/${menu.id}`).loginAs(admin)
    deleteResponse.assertStatus(204)
  })

  test('reject menu create without permission', async ({ client }) => {
    const user = await User.create({
      fullName: 'Menu Limited User',
      email: `menu-limited-${Date.now()}@example.com`,
      password: 'password123',
    })

    const response = await client
      .post('/api/admin/menus')
      .loginAs(user)
      .json({
        name: 'Forbidden Menu',
        slug: `forbidden-menu-${Date.now()}`,
      })

    response.assertStatus(403)
  })
})
