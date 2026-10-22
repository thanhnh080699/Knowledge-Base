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
        .use('index', middleware.acl({ permission: ['api_tokens.read', 'api_tokens.manage'] }))
        .use('store', middleware.acl({ permission: ['api_tokens.create', 'api_tokens.manage'] }))
        .use('update', middleware.acl({ permission: ['api_tokens.update', 'api_tokens.manage'] }))
        .use('destroy', middleware.acl({ permission: ['api_tokens.delete', 'api_tokens.manage'] }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
