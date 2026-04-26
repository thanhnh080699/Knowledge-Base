import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const MenusController = () => import('#controllers/menus_controller')

export default function menusRoutes() {
  router.get('menus/default', [MenusController, 'defaultMenu']).as('menus.public.default')
  router.get('menus', [MenusController, 'index']).as('menus.public.index')
  router.get('menus/:id', [MenusController, 'show']).as('menus.public.show')

  router
    .group(() => {
      router
        .post('menus/:id/default', [MenusController, 'setDefault'])
        .use(middleware.acl({ permission: 'menus.manage' }))
      router
        .put('menus/:id/items', [MenusController, 'syncItemsAction'])
        .use(middleware.acl({ permission: 'menus.manage' }))
      router
        .resource('menus', MenusController)
        .use('*', middleware.acl({ permission: 'menus.manage' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
