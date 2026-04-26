import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')

export default function usersRoutes() {
  // Admin only
  router
    .group(() => {
      router
        .delete('users/:id/force', [UsersController, 'forceDestroy'])
        .use(middleware.acl({ permission: 'users.manage' }))
      router
        .post('users/:id/change-password', [UsersController, 'changePassword'])
        .use(middleware.acl({ permission: 'users.manage' }))
      router
        .get('users/meta', [UsersController, 'meta'])
        .use(middleware.acl({ permission: 'users.manage' }))
      router
        .resource('users', UsersController)
        .use('*', middleware.acl({ permission: 'users.manage' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
