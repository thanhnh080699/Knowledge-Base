/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

// Import module routes
import authRoutes from './routes/auth.js'
import postsRoutes from './routes/posts.js'
import categoriesRoutes from './routes/categories.js'
import tagsRoutes from './routes/tags.js'
import pagesRoutes from './routes/pages.js'
import menusRoutes from './routes/menus.js'
import projectsRoutes from './routes/projects.js'
import servicesRoutes from './routes/services.js'
import contactsRoutes from './routes/contacts.js'
import usersRoutes from './routes/users.js'
import rolesRoutes from './routes/roles.js'
import permissionsRoutes from './routes/permissions.js'
import mediaRoutes from './routes/media.js'
import settingsRoutes from './routes/settings.js'

router.get('/', () => {
  return { hello: 'world' }
})

router.get('/health', () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Swagger documentation
router.get('/swagger', async () => {
  return AutoSwagger.default.ui('/docs', swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.json(router.toJSON(), swagger)
})

const SitemapsController = () => import('#controllers/sitemaps_controller')

// Public routes (outside /api)
router.get('/sitemap.xml', [SitemapsController, 'index'])
router.get('/sitemap-:section.xml', [SitemapsController, 'section'])

// API Routes
router
  .group(() => {
    authRoutes()
    postsRoutes()
    categoriesRoutes()
    tagsRoutes()
    pagesRoutes()
    menusRoutes()
    projectsRoutes()
    servicesRoutes()
    contactsRoutes()
    usersRoutes()
    rolesRoutes()
    permissionsRoutes()
    mediaRoutes()
    settingsRoutes()
  })
  .prefix('/api')
