import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ToolsController = () => import('#controllers/tools_controller')

export default function toolsRoutes() {
  // Public
  router.get('tools', [ToolsController, 'index']).as('tools.public.index')
  router.get('tools/:id', [ToolsController, 'show']).as('tools.public.show')

  // Admin
  router.group(() => {
    router.resource('tools', ToolsController)
      .use('*', middleware.acl({ permission: 'tools.manage' }))
  }).prefix('admin').use(middleware.auth())
}
