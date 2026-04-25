import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ServicesController = () => import('#controllers/services_controller')

export default function servicesRoutes() {
  // Public
  router.get('services', [ServicesController, 'index']).as('services.public.index')
  router.get('services/:id', [ServicesController, 'show']).as('services.public.show')

  // Admin
  router.group(() => {
    router.resource('services', ServicesController)
      .use('*', middleware.acl({ permission: 'services.manage' }))
  }).prefix('admin').use(middleware.auth())
}
