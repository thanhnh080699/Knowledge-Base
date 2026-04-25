import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProjectsController = () => import('#controllers/projects_controller')

export default function projectsRoutes() {
  // Public
  router.get('projects', [ProjectsController, 'index']).as('projects.public.index')
  router.get('projects/:id', [ProjectsController, 'show']).as('projects.public.show')

  // Admin
  router.group(() => {
    router.resource('projects', ProjectsController)
      .use('*', middleware.acl({ permission: 'projects.manage' }))
  }).prefix('admin').use(middleware.auth())
}
