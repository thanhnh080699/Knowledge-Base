import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth', (group) => {
  group.each.setup(async () => {
    // Truncate users table before each test if using a test DB
    // But since we are in dev, we might just want to ensure a test user exists
    await User.query().where('email', 'test@example.com').delete()
  })

  test('login with valid credentials', async ({ client, assert }) => {
    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.post('/api/auth/login').json({
      email: 'test@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.properties(response.body().data.token, ['type', 'token', 'expiresAt'])
  })

  test('login with invalid credentials', async ({ client }) => {
    const response = await client.post('/api/auth/login').json({
      email: 'test@example.com',
      password: 'wrongpassword',
    })

    response.assertStatus(400)
  })

  test('get current user info', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.get('/api/auth/me').loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().data.email, 'test@example.com')
  })
})
