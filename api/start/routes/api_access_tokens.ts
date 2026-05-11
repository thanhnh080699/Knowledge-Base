import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ApiAccessTokensController = () => import('#controllers/api_access_tokens_controller')

export default function apiAccessTokensRoutes() {
  router
    .group(() => {
      router
        .resource('api-access-tokens', ApiAccessTokensController)
        .apiOnly()
        .except(['show'])
        .use('*', middleware.acl({ permission: 'api_tokens.manage' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
