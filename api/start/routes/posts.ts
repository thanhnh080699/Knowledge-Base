import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PostsController = () => import('#controllers/posts_controller')

export default function postsRoutes() {
  // Public
  router.get('posts', [PostsController, 'index']).as('posts.public.index')
  router.get('posts/:id', [PostsController, 'show']).as('posts.public.show')

  // Automation API token routes
  router.group(() => {
    router.get('posts', [PostsController, 'index']).as('automation.posts.index').use(middleware.apiToken({ permission: 'posts.read' }))
    router.get('posts/:id', [PostsController, 'show']).as('automation.posts.show').use(middleware.apiToken({ permission: 'posts.read' }))
    router.post('posts', [PostsController, 'store']).as('automation.posts.store').use(middleware.apiToken({ permission: 'posts.create' }))
    router.put('posts/:id', [PostsController, 'update']).as('automation.posts.update').use(middleware.apiToken({ permission: 'posts.update' }))
    router.delete('posts/:id', [PostsController, 'destroy']).as('automation.posts.destroy').use(middleware.apiToken({ permission: 'posts.delete' }))
  }).prefix('automation')

  // Admin
  router.group(() => {
    router
      .post('posts/:id/restore', [PostsController, 'restore'])
      .use(middleware.acl({ permission: 'posts.manage' }))
    router
      .delete('posts/:id/force', [PostsController, 'forceDestroy'])
      .use(middleware.acl({ permission: 'posts.manage' }))
    router.resource('posts', PostsController)
      .use('*', middleware.acl({ permission: 'posts.manage' }))
  }).prefix('admin').use(middleware.auth())
}
