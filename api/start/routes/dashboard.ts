import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const DashboardController = () => import('#controllers/dashboard_controller')

export default function dashboardRoutes() {
  router
    .group(() => {
      router.get('dashboard', [DashboardController, 'overview'])
      router
        .get('dashboard/views', [DashboardController, 'views'])
        .use(middleware.acl({ permission: 'posts.manage' }))
      router
        .get('dashboard/seo-issues', [DashboardController, 'seoIssues'])
        .use(middleware.acl({ permission: ['posts.read', 'posts.manage'] }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
