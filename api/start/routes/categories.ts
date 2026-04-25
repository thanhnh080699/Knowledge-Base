import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CategoriesController = () => import('#controllers/categories_controller')

export default function categoriesRoutes() {
  // Public
  router.get('categories', [CategoriesController, 'index']).as('categories.public.index')
  router.get('categories/:id', [CategoriesController, 'show']).as('categories.public.show')

  // Admin
  router.group(() => {
    router.resource('categories', CategoriesController)
      .use('*', middleware.acl({ permission: 'categories.manage' }))
  }).prefix('admin').use(middleware.auth())
}
