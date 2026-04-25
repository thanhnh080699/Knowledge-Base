import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PermissionsController = () => import('#controllers/permissions_controller')

export default function permissionsRoutes() {
  router
    .group(() => {
      router
        .resource('permissions', PermissionsController)
        .only(['index', 'show'])
        .use('*', middleware.acl({ permission: 'permissions.read' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
