import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'

test.group('Permissions', () => {
  async function createAclAdmin() {
    const admin = await User.firstOrCreate(
      { email: `admin-permissions-${Date.now()}@example.com` },
      {
        fullName: 'Permissions Admin',
        password: 'password123',
      }
    )

    const adminRole = await Role.firstOrCreate(
      { slug: `permissions-admin-${Date.now()}` },
      {
        name: 'Permissions Administrator',
        description: 'Can manage permissions',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'permissions.manage' },
      {
        name: 'Manage Permissions',
        module: 'permissions',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return { admin }
  }

  test('create and update a permission', async ({ client, assert }) => {
    const { admin } = await createAclAdmin()

    const createResponse = await client
      .post('/api/admin/permissions')
      .loginAs(admin)
      .json({
        name: 'Manage Tours',
        slug: `tours.manage.${Date.now()}`,
        module: 'tours',
      })
    const createdPermission = (createResponse.body() as any).data as { id: number }

    createResponse.assertStatus(201)
    const permissionId = createdPermission.id

    const updateResponse = await client
      .put(`/api/admin/permissions/${permissionId}`)
      .loginAs(admin)
      .json({
        name: 'Manage All Tours',
        module: 'travel',
      })

    updateResponse.assertStatus(200)
    assert.equal(updateResponse.body().data.name, 'Manage All Tours')
    assert.equal(updateResponse.body().data.module, 'travel')
  })

  test('soft delete a permission and filter deleted permissions', async ({ client, assert }) => {
    const { admin } = await createAclAdmin()
    const permission = await Permission.create({
      name: 'Delete Me',
      slug: `delete-me-${Date.now()}`,
      module: 'testing',
    })

    const destroyResponse = await client
      .delete(`/api/admin/permissions/${permission.id}`)
      .loginAs(admin)
    destroyResponse.assertStatus(204)

    const deletedResponse = await client
      .get('/api/admin/permissions')
      .qs({ status: 'deleted' })
      .loginAs(admin)

    deletedResponse.assertStatus(200)
    const deletedPermissions = deletedResponse.body().data as Array<{ id: number }>
    assert.isTrue(deletedPermissions.some((item) => item.id === permission.id))
  })
})
