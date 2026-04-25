import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RolesController = () => import('#controllers/roles_controller')

export default function rolesRoutes() {
  router
    .group(() => {
      router
        .get('roles/meta', [RolesController, 'meta'])
        .use(middleware.acl({ permission: 'roles.manage' }))
      router
        .resource('roles', RolesController)
        .use('*', middleware.acl({ permission: 'roles.manage' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
