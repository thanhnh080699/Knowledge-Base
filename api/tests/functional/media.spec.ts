import { test } from '@japa/runner'
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
    assert.equal(response.body().data.current_folder, 'docs')
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
    assert.equal(response.body().data.path, 'archive/image.png')
  })
})
