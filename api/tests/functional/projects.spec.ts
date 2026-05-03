import { test } from '@japa/runner'
import User from '#models/user'
import Role from '#models/role'
import Permission from '#models/permission'
import Project from '#models/project'

test.group('Projects', (group) => {
  let admin: User

  group.setup(async () => {
    admin = await User.firstOrCreate(
      { email: 'projects-admin@example.com' },
      {
        fullName: 'Projects Admin',
        password: 'password123',
      }
    )

    const adminRole = await Role.firstOrCreate(
      { slug: 'admin' },
      {
        name: 'Administrator',
      }
    )

    const permission = await Permission.firstOrCreate(
      { slug: 'projects.manage' },
      {
        name: 'Manage Projects',
        module: 'Projects',
      }
    )

    await adminRole.related('permissions').sync([permission.id])
    await admin.related('roles').sync([adminRole.id])
  })

  test('create list show update and delete project content as admin', async ({ client, assert }) => {
    const slug = `project-content-${Date.now()}`

    const createResponse = await client.post('/api/admin/projects').loginAs(admin).json({
      title: 'Project Content Functional',
      slug,
      description: 'Short case study summary',
      content: '<h2>Problem</h2><p>Delivered CMS, API and CDN workflow.</p>',
      techStack: ['Next.js', 'AdonisJS', 'Gin'],
      thumbnailUrl: 'Projects/demo.png',
      demoUrl: 'https://example.com',
      repoUrl: 'https://github.com/example/project',
      featured: true,
      status: 'PUBLISHED',
    })

    createResponse.assertStatus(201)
    const createdBody = createResponse.body() as unknown as {
      data: { content: string; status: string }
    }
    assert.equal(createdBody.data.content, '<h2>Problem</h2><p>Delivered CMS, API and CDN workflow.</p>')
    assert.equal(createdBody.data.status, 'PUBLISHED')

    const listResponse = await client.get('/api/projects').qs({ q: slug })
    listResponse.assertStatus(200)
    const listBody = listResponse.body() as unknown as { data: Array<{ slug: string }> }
    assert.isTrue(listBody.data.some((project) => project.slug === slug))

    const showResponse = await client.get(`/api/projects/${slug}`)
    showResponse.assertStatus(200)
    const showBody = showResponse.body() as unknown as { data: { slug: string } }
    assert.equal(showBody.data.slug, slug)

    const project = await Project.findByOrFail('slug', slug)
    const updateResponse = await client
      .put(`/api/admin/projects/${project.id}`)
      .loginAs(admin)
      .json({ content: '<p>Updated case study.</p>', status: 'ARCHIVED' })

    updateResponse.assertStatus(200)
    const updateBody = updateResponse.body() as unknown as {
      data: { content: string; status: string }
    }
    assert.equal(updateBody.data.content, '<p>Updated case study.</p>')
    assert.equal(updateBody.data.status, 'ARCHIVED')

    const hiddenResponse = await client.get(`/api/projects/${slug}`)
    hiddenResponse.assertStatus(404)

    const deleteResponse = await client.delete(`/api/admin/projects/${project.id}`).loginAs(admin)
    deleteResponse.assertStatus(204)
  })

  test('reject project create without permission', async ({ client }) => {
    const user = await User.create({
      fullName: 'Project Limited User',
      email: `project-limited-${Date.now()}@example.com`,
      password: 'password123',
    })

    const response = await client.post('/api/admin/projects').loginAs(user).json({
      title: 'Forbidden Project',
      slug: `forbidden-project-${Date.now()}`,
      description: 'Should not be created',
    })

    response.assertStatus(403)
  })
})
