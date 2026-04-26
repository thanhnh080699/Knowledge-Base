import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Setting from '#models/setting'

test.group('Settings', () => {
  async function createSettingsAdmin() {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const admin = await User.firstOrCreate(
      { email: `admin-settings-${suffix}@example.com` },
      {
        fullName: 'Settings Admin',
        password: 'password123',
      }
    )

    const adminRole = await Role.firstOrCreate(
      { slug: `settings-admin-${suffix}` },
      {
        name: `Settings Administrator ${suffix}`,
        description: 'Can manage settings',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'settings.manage' },
      {
        name: 'Manage Settings',
        module: 'Settings',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])

    return admin
  }

  test('return seeded overview settings as a key-value group', async ({ client, assert }) => {
    const admin = await createSettingsAdmin()

    const response = await client.get('/api/admin/settings/overview').loginAs(admin)
    response.assertStatus(200)

    const body = response.body().data as {
      group: string
      settings: Array<{ settingKey: string }>
      values: Record<string, unknown>
    }

    assert.equal(body.group, 'overview')
    assert.isTrue(body.settings.some((setting) => setting.settingKey === 'site_name'))
    assert.equal(body.values.site_name, 'thanhnh.id.vn')
  })

  test('update overview settings and persist typed values', async ({ client, assert }) => {
    const admin = await createSettingsAdmin()

    const response = await client
      .put('/api/admin/settings/overview')
      .loginAs(admin)
      .json({
        settings: [
          { key: 'site_name', value: 'Thanh Nguyen Knowledge Base' },
          { key: 'maintenance_mode', value: true, type: 'boolean' },
        ],
      })

    response.assertStatus(200)
    assert.equal(response.body().data.values.site_name, 'Thanh Nguyen Knowledge Base')
    assert.equal(response.body().data.values.maintenance_mode, true)

    const siteName = await Setting.query()
      .where('setting_group', 'overview')
      .where('setting_key', 'site_name')
      .firstOrFail()

    assert.equal(siteName.settingValue, 'Thanh Nguyen Knowledge Base')
  })
})
