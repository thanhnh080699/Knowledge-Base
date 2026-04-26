import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'

test.group('Users', () => {
  async function createAdminUser() {
    const admin = await User.firstOrCreate(
      { email: `admin-users-${Date.now()}@example.com` },
      {
        fullName: 'Users Admin',
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
      { slug: 'users.manage' },
      {
        name: 'Manage Users',
        module: 'users',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return { admin, adminRole, permission }
  }

  test('list ACL metadata for users module', async ({ client, assert }) => {
    const { admin, adminRole, permission } = await createAdminUser()

    const response = await client.get('/api/admin/users/meta').loginAs(admin)
    const role = response
      .body()
      .data.roles.find((item: { slug: string }) => item.slug === adminRole.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data.roles)
    if (!role) {
      throw new Error('Expected admin role to be returned by users meta endpoint')
    }
    assert.equal(role.slug, adminRole.slug)
    assert.equal(role.permissions[0].slug, permission.slug)
  })

  test('create a new user with assigned roles', async ({ client, assert }) => {
    const { admin, adminRole } = await createAdminUser()

    const response = await client
      .post('/api/admin/users')
      .loginAs(admin)
      .json({
        fullName: 'Jane Editor',
        email: `jane-${Date.now()}@example.com`,
        password: 'password123',
        roleIds: [adminRole.id],
      })
    const body = response.body() as { data: { roles: Array<{ id: number }> } }

    response.assertStatus(201)
    assert.equal(body.data.roles.length, 1)
    assert.equal(body.data.roles[0].id, adminRole.id)
  })

  test('soft delete a user and filter deleted users', async ({ client, assert }) => {
    const { admin } = await createAdminUser()
    const user = await User.create({
      fullName: 'Soft Delete User',
      email: `soft-delete-${Date.now()}@example.com`,
      password: 'password123',
    })

    const destroyResponse = await client.delete(`/api/admin/users/${user.id}`).loginAs(admin)
    destroyResponse.assertStatus(204)

    const activeResponse = await client.get('/api/admin/users').loginAs(admin)
    activeResponse.assertStatus(200)
    const activeUsers = activeResponse.body().data as Array<{ id: number }>
    assert.isFalse(activeUsers.some((item) => item.id === user.id))

    const deletedResponse = await client
      .get('/api/admin/users')
      .qs({ status: 'deleted' })
      .loginAs(admin)

    deletedResponse.assertStatus(200)
    const deletedUsers = deletedResponse.body().data as Array<{ id: number }>
    assert.isTrue(deletedUsers.some((item) => item.id === user.id))
  })
})
