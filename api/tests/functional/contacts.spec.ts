import { test } from '@japa/runner'
import ContactRequest from '#models/contact_request'
import Newsletter from '#models/newsletter'

test.group('Contacts & Newsletter', (group) => {
  group.each.setup(async () => {
    await ContactRequest.query().where('email', 'contact@test.com').delete()
    await Newsletter.query().where('email', 'news@test.com').delete()
  })

  test('submit a contact request', async ({ client, assert }) => {
    const payload = {
      name: 'John Doe',
      email: 'contact@test.com',
      subject: 'Hello',
      message: 'This is a test message',
    }

    const response = await client.post('/api/contact').json(payload)

    response.assertStatus(201)
    assert.equal(response.body().data.email, payload.email)
  })

  test('subscribe to newsletter', async ({ client, assert }) => {
    const payload = {
      email: 'news@test.com',
    }

    const response = await client.post('/api/newsletter').json(payload)

    response.assertStatus(201)
    assert.equal(response.body().data.email, payload.email)
  })

  test('cannot subscribe twice with same email', async ({ client }) => {
    await Newsletter.create({ email: 'news@test.com' })

    const response = await client.post('/api/newsletter').json({
      email: 'news@test.com',
    })

    response.assertStatus(422)
  })
})
