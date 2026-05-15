import { test } from '@japa/runner'
import Permission from '#models/permission'
import Role from '#models/role'
import User from '#models/user'

test.group('Media gateway', (group) => {
  let originalFetch: typeof fetch

  group.setup(() => {
    originalFetch = globalThis.fetch
  })

  group.teardown(() => {
    globalThis.fetch = originalFetch
  })

  test('lists media through CDN gateway', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Media Admin',
      email: 'media-admin@example.com',
      password: 'password123',
    })

    globalThis.fetch = async (input) => {
      const url = new URL(input.toString())
      assert.equal(url.pathname, '/api/media')
      assert.equal(url.searchParams.get('folder'), 'docs')
      return Response.json({
        data: {
          current_folder: 'docs',
          folders: [],
          files: [],
        },
      })
    }

    const response = await client.get('/api/admin/media?folder=docs').loginAs(user)

    response.assertStatus(200)
    assert.equal((response.body() as any).data.current_folder, 'docs')
  })

  test('moves media through CDN gateway', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Move Admin',
      email: 'move-admin@example.com',
      password: 'password123',
    })

    globalThis.fetch = async (input, init) => {
      const url = new URL(input.toString())
      assert.equal(url.pathname, '/api/media/move')
      assert.equal(init?.method, 'PUT')
      assert.include(String(init?.body), 'docs/image.png')
      return Response.json({
        data: {
          path: 'archive/image.png',
        },
      })
    }

    const response = await client
      .put('/api/admin/media/move')
      .json({ path: 'docs/image.png', folder: 'archive' })
      .loginAs(user)

    response.assertStatus(200)
    assert.equal((response.body() as any).data.path, 'archive/image.png')
  })

  test('lists media through automation API token', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Automation Media Admin',
      email: `automation-media-admin-${Date.now()}@example.com`,
      password: 'password123',
    })
    const role = await Role.firstOrCreate(
      { slug: `automation-media-admin-${Date.now()}` },
      { name: 'Automation Media Admin' }
    )
    const manageTokens = await Permission.firstOrCreate(
      { slug: 'api_tokens.manage' },
      { name: 'Manage API Tokens', module: 'API Tokens' }
    )
    const readMedia = await Permission.firstOrCreate(
      { slug: 'media.read' },
      { name: 'Read Media', module: 'Media' }
    )

    await role.related('permissions').sync([manageTokens.id])
    await user.related('roles').sync([role.id])

    const tokenResponse = await client
      .post('/api/admin/api-access-tokens')
      .loginAs(user)
      .json({
        name: 'Media automation',
        expiresIn: '1_week',
        permissions: [readMedia.slug],
      })
    const plainToken = tokenResponse.body().data.token as string

    globalThis.fetch = async (input) => {
      const url = new URL(input.toString())
      assert.equal(url.pathname, '/api/media')
      assert.equal(url.searchParams.get('folder'), 'Posts')
      return Response.json({
        data: {
          current_folder: 'Posts',
          folders: [],
          files: [],
        },
      })
    }

    const response = await client
      .get('/api/automation/media')
      .header('x-api-token', plainToken)
      .qs({ folder: 'Posts' })

    response.assertStatus(200)
    assert.equal((response.body() as any).data.current_folder, 'Posts')
  })
})
