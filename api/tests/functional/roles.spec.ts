import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'

test.group('Roles', () => {
  async function createAclAdmin() {
    const admin = await User.firstOrCreate(
      { email: `admin-roles-${Date.now()}@example.com` },
      {
        fullName: 'Roles Admin',
        password: 'password123',
      }
    )

    const adminRole = await Role.firstOrCreate(
      { slug: `roles-admin-${Date.now()}` },
      {
        name: 'Roles Administrator',
        description: 'Can manage roles',
      }
    )

    const rolePermission = await Permission.firstOrCreate(
      { slug: 'roles.manage' },
      {
        name: 'Manage Roles',
        module: 'roles',
      }
    )

    const usersPermission = await Permission.firstOrCreate(
      { slug: 'users.manage' },
      {
        name: 'Manage Users',
        module: 'users',
      }
    )

    await adminRole.related('permissions').sync([rolePermission.id, usersPermission.id])
    await admin.related('roles').sync([adminRole.id])

    return { admin, usersPermission }
  }

  test('create and update a role with permissions', async ({ client, assert }) => {
    const { admin, usersPermission } = await createAclAdmin()

    const createResponse = await client
      .post('/api/admin/roles')
      .loginAs(admin)
      .json({
        name: 'Content Manager',
        slug: `content-manager-${Date.now()}`,
        description: 'Role for content team',
        permissionIds: [usersPermission.id],
      })
    const createdRole = createResponse.body().data as {
      id: string
      permissions: Array<{ id: string }>
    }

    createResponse.assertStatus(201)
    assert.equal(createdRole.permissions.length, 1)

    const roleId = createdRole.id

    const updateResponse = await client.put(`/api/admin/roles/${roleId}`).loginAs(admin).json({
      description: 'Updated description',
      permissionIds: [],
    })

    updateResponse.assertStatus(200)
    assert.equal(updateResponse.body().data.description, 'Updated description')
    assert.equal(updateResponse.body().data.permissions.length, 0)
  })

  test('soft delete a role and return it from deleted filter', async ({ client, assert }) => {
    const { admin } = await createAclAdmin()
    const role = await Role.create({
      name: 'Temporary Role',
      slug: `temporary-role-${Date.now()}`,
      description: 'Role to be deleted',
    })

    const destroyResponse = await client.delete(`/api/admin/roles/${role.id}`).loginAs(admin)
    destroyResponse.assertStatus(204)

    const deletedResponse = await client
      .get('/api/admin/roles')
      .qs({ status: 'deleted' })
      .loginAs(admin)
    deletedResponse.assertStatus(200)
    const deletedRoles = deletedResponse.body().data as Array<{ id: string }>
    assert.isTrue(deletedRoles.some((item) => item.id === role.id))
  })
})
