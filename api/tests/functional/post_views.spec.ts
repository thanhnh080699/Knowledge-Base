import { test } from '@japa/runner'
import Post from '#models/post'
import { DateTime } from 'luxon'

test.group('Post views', () => {
  test('only explicit visits increment views, including concurrent visits', async ({
    client,
    assert,
  }) => {
    const post = await Post.create({
      title: 'View test',
      slug: `view-test-${Date.now()}`,
      content: 'Test',
      status: 'PUBLISHED',
      views: 0,
    })
    try {
      const readResponse = await client.get(`/api/posts/${post.id}`)
      readResponse.assertStatus(200)
      await post.refresh()
      assert.equal(post.views, 0)
      const responses = await Promise.all(
        Array.from({ length: 5 }, () => client.post(`/api/posts/${post.id}/view`))
      )
      responses.forEach((response) => response.assertStatus(204))
      await post.refresh()
      assert.equal(post.views, 5)
    } finally {
      await post.delete()
    }
  })

  test('rejects unpublished, deleted and missing posts', async ({ client, assert }) => {
    for (const status of ['DRAFT', 'ARCHIVED', 'PUBLISHED'] as const) {
      const post = await Post.create({
        title: 'Hidden',
        slug: `hidden-${status}-${Date.now()}`,
        content: 'Test',
        status,
        views: 0,
        deletedAt: status === 'PUBLISHED' ? DateTime.utc() : null,
      })
      try {
        const response = await client.post(`/api/posts/${post.id}/view`)
        response.assertStatus(404)
        await post.refresh()
        assert.equal(post.views, 0)
      } finally {
        await post.delete()
      }
    }
    const missingResponse = await client.post('/api/posts/999999999/view')
    missingResponse.assertStatus(404)
  })
})
