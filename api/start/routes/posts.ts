import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PostsController = () => import('#controllers/posts_controller')

export default function postsRoutes() {
  // Public
  router.get('posts', [PostsController, 'index']).as('posts.public.index')
  router.get('posts/:id', [PostsController, 'show']).as('posts.public.show')

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
