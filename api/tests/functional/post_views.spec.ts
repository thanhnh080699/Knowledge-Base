import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Post from '#models/post'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import { viewDetails, viewerIp } from '#services/post_view_details'

const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36'

test.group('Post view statistics', (group) => {
  let post: Post
  let admin: User
  let user: User

  group.setup(async () => {
    post = await Post.create({
      title: 'View test',
      slug: `view-test-${Date.now()}`,
      content: 'Test',
      status: 'PUBLISHED',
      views: 7,
    })
    admin = await User.create({
      fullName: 'Views admin',
      email: `views-admin-${Date.now()}@example.com`,
      password: 'test-password',
    })
    user = await User.create({
      fullName: 'Views user',
      email: `views-user-${Date.now()}@example.com`,
      password: 'test-password',
    })
    const role = await Role.firstOrCreate(
      { slug: 'view-test-manager' },
      { name: 'View test manager' }
    )
    const permission = await Permission.firstOrCreate(
      { slug: 'posts.manage' },
      { name: 'Manage posts', module: 'posts' }
    )
    await role.related('permissions').sync([permission.id])
    await admin.related('roles').attach([role.id])
  })
  group.teardown(async () => {
    await db.from('post_views').where('post_id', post.id).delete()
    await post.delete()
    await admin.delete()
    await user.delete()
  })

  test('API reads do not count; concurrent legacy visits share the deduplication bucket', async ({ client, assert }) => {
    const fresh = await Post.create({ title: 'Concurrent views', slug: `views-concurrent-${Date.now()}`, content: 'Test', status: 'PUBLISHED', views: 0 })
    try {
      const read = await client.get(`/api/posts/${fresh.id}`)
      read.assertStatus(200)
      await fresh.refresh()
      assert.equal(fresh.views, 0)
      const responses = await Promise.all(Array.from({ length: 5 }, () => client.post(`/api/posts/${fresh.id}/view`).header('user-agent', agent)))
      responses.forEach(response => response.assertStatus(204))
      await fresh.refresh()
      assert.equal(fresh.views, 1)
    } finally {
      await db.from('post_views').where('post_id', fresh.id).delete()
      await fresh.delete()
    }
  })

  test('records browser IP and safe referrer; retries do not double-count', async ({
    client,
    assert,
  }) => {
    for (let i = 0; i < 2; i++) {
      const response = await client
        .post(`/api/posts/${post.id}/views`)
        .header('user-agent', agent)
        .json({
          referrer: 'https://example.com/private?token=secret',
          ip: '1.1.1.1',
          country: 'FAKE',
        })
      response.assertStatus(204)
    }
    await post.refresh()
    assert.equal(post.views, 8)
    const rows = await db.from('post_views').where('post_id', post.id)
    assert.lengthOf(rows, 1)
    assert.notEqual(rows[0].ip, '1.1.1.1')
    assert.equal(rows[0].referrer, 'example.com')
    assert.equal(rows[0].browser, 'Chrome')
    assert.equal(rows[0].os, 'Windows')
  })

  test('private detail requires authentication and permission', async ({ client, assert }) => {
    const anonymous = await client.get(`/api/admin/posts/${post.id}/views`)
    anonymous.assertStatus(401)
    const denied = await client.get(`/api/admin/posts/${post.id}/views`).loginAs(user)
    denied.assertStatus(403)
    const response = await client.get(`/api/admin/posts/${post.id}/views`).loginAs(admin)
    response.assertStatus(200)
    assert.equal(response.body().data.length, 1)
    assert.isUndefined(response.body().data[0].visitor_key)
    assert.include(response.headers()['cache-control'], 'no-store')
    const publicPost = await client.get(`/api/posts/${post.id}`)
    assert.isUndefined(publicPost.body().data.ip)
    assert.isUndefined(publicPost.body().data.postViews)
    const automation = await client.get(`/api/automation/posts/${post.id}/views`)
    automation.assertStatus(404)
  })

  test('ignores bots and rejects unpublished, deleted and missing posts', async ({
    client,
    assert,
  }) => {
    const bot = await client.post(`/api/posts/${post.id}/views`).header('user-agent', 'Googlebot')
    bot.assertStatus(204)
    await post.refresh()
    assert.equal(post.views, 8)
    post.status = 'DRAFT'
    await post.save()
    const draft = await client.post(`/api/posts/${post.id}/views`).header('user-agent', agent)
    draft.assertStatus(404)
    post.status = 'PUBLISHED'
    post.deletedAt = DateTime.utc()
    await post.save()
    const deleted = await client.post(`/api/posts/${post.id}/views`).header('user-agent', agent)
    deleted.assertStatus(404)
    const missing = await client.post('/api/posts/2147483647/views').header('user-agent', agent)
    missing.assertStatus(404)
    await post.refresh()
    assert.equal(post.views, 8)
  })

  test('geolocation and normalization tolerate unknown inputs', async ({ assert }) => {
    const local = viewDetails('::ffff:127.0.0.1', agent, 'javascript:alert(1)', 0)
    assert.equal(local.ip, '127.0.0.1')
    assert.isNull(local.country)
    assert.isNull(local.referrer)
    const invalid = viewDetails('invalid', agent, { referrer: 'bad' }, 0)
    assert.isNull(invalid.ip)
    assert.isNull(invalid.country)
    assert.notEqual(local.visitor_key, viewDetails('127.0.0.1', agent, '', 1_800_000).visitor_key)
    assert.isNotNull(viewDetails('8.8.8.8', agent, '', 0).country)
    assert.equal(
      viewerIp('192.168.12.100', '192.168.12.100', '8.8.8.8', '192.168.12.100'),
      '8.8.8.8'
    )
    assert.equal(
      viewerIp('192.168.12.100', '192.168.12.100', '1.1.1.1, 8.8.8.8', '192.168.12.100'),
      '8.8.8.8'
    )
    assert.equal(
      viewerIp('192.168.12.101', '192.168.12.101', '8.8.8.8', '192.168.12.100'),
      '192.168.12.101'
    )
    assert.equal(
      viewerIp('192.168.12.100', '192.168.12.100', 'invalid', '192.168.12.100'),
      '192.168.12.100'
    )
  })
})
