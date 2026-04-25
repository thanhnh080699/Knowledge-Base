import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TagsController = () => import('#controllers/tags_controller')

export default function tagsRoutes() {
  // Public
  router.get('tags', [TagsController, 'index']).as('tags.public.index')
  router.get('tags/:id', [TagsController, 'show']).as('tags.public.show')

  // Admin
  router.group(() => {
    router.resource('tags', TagsController)
      .use('*', middleware.acl({ permission: 'tags.manage' }))
  }).prefix('admin').use(middleware.auth())
}
