import { test } from '@japa/runner'
import Category from '#models/category'
import Post from '#models/post'
import Project from '#models/project'
import Tool from '#models/tool'

test.group('Sitemaps', (group) => {
  group.setup(async () => {
    await Post.query().where('slug', 'sitemap-functional-post').delete()
    await Category.query().where('slug', 'sitemap-functional-category').delete()
    await Project.query().where('slug', 'sitemap-functional-project').delete()
    await Tool.query().where('slug', 'sitemap-functional-tool').delete()

    const category = await Category.create({
      name: 'Sitemap Functional Category',
      slug: 'sitemap-functional-category',
      description: 'Category used by sitemap tests',
      sortOrder: 0,
    })

    await Post.create({
      title: 'Sitemap Functional Post',
      slug: 'sitemap-functional-post',
      content: 'Sitemap content',
      excerpt: 'Sitemap excerpt',
      status: 'PUBLISHED',
      categoryId: category.id,
    })

    await Project.create({
      title: 'Sitemap Functional Project',
      slug: 'sitemap-functional-project',
      description: 'Sitemap project',
      content: 'Project content',
      techStack: ['AdonisJS'],
      featured: true,
      status: 'PUBLISHED',
    })

    await Tool.create({
      name: 'Sitemap Functional Tool',
      slug: 'sitemap-functional-tool',
      description: 'Sitemap tool',
      category: 'Crypto',
      urlPath: '/tools/sitemap-functional-tool',
      featured: true,
      status: 'PUBLISHED',
      sortOrder: 1,
    })
  })

  test('serves sitemap index with all sections', async ({ client, assert }) => {
    const response = await client.get('/sitemap.xml')
    const body = response.text()

    response.assertStatus(200)
    assert.include(response.header('content-type') ?? '', 'application/xml')
    assert.include(body, '<sitemapindex')
    assert.include(body, 'https://thanhnh.id.vn/sitemap-static.xml')
    assert.include(body, 'https://thanhnh.id.vn/sitemap-posts.xml')
    assert.include(body, 'https://thanhnh.id.vn/sitemap-tools.xml')
  })

  test('generates FE-compatible content URLs', async ({ client, assert }) => {
    const postsResponse = await client.get('/sitemap-posts.xml')
    const categoriesResponse = await client.get('/sitemap-categories.xml')
    const projectsResponse = await client.get('/sitemap-projects.xml')
    const toolsResponse = await client.get('/sitemap-tools.xml')

    postsResponse.assertStatus(200)
    categoriesResponse.assertStatus(200)
    projectsResponse.assertStatus(200)
    toolsResponse.assertStatus(200)

    assert.include(
      postsResponse.text(),
      'https://thanhnh.id.vn/docs/sitemap-functional-category/sitemap-functional-post'
    )
    assert.include(
      categoriesResponse.text(),
      'https://thanhnh.id.vn/docs/categories/sitemap-functional-category'
    )
    assert.include(
      projectsResponse.text(),
      'https://thanhnh.id.vn/projects/sitemap-functional-project'
    )
    assert.include(toolsResponse.text(), 'https://thanhnh.id.vn/tools/sitemap-functional-tool')
  })
})
