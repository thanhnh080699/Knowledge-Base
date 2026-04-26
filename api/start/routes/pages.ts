import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PagesController = () => import('#controllers/pages_controller')

export default function pagesRoutes() {
  router.get('pages/homepage', [PagesController, 'homepage']).as('pages.public.homepage')
  router.get('pages', [PagesController, 'index']).as('pages.public.index')
  router.get('pages/:id', [PagesController, 'show']).as('pages.public.show')

  router
    .group(() => {
      router
        .post('pages/:id/homepage', [PagesController, 'setHomepage'])
        .use(middleware.acl({ permission: 'pages.manage' }))
      router
        .post('pages/:id/restore', [PagesController, 'restore'])
        .use(middleware.acl({ permission: 'pages.manage' }))
      router
        .delete('pages/:id/force', [PagesController, 'forceDestroy'])
        .use(middleware.acl({ permission: 'pages.manage' }))
      router
        .resource('pages', PagesController)
        .use('*', middleware.acl({ permission: 'pages.manage' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
