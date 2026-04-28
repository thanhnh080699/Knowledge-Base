import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CommentsController = () => import('#controllers/comments_controller')

export default function commentsRoutes() {
  router
    .get('posts/:postId/comments', [CommentsController, 'publicForPost'])
    .as('comments.public.index')
  router
    .post('posts/:postId/comments', [CommentsController, 'storePublic'])
    .as('comments.public.store')

  router
    .group(() => {
      router
        .get('comments', [CommentsController, 'index'])
        .use(middleware.acl({ permission: 'comments.manage' }))
      router
        .patch('comments/:id/status', [CommentsController, 'updateStatus'])
        .use(middleware.acl({ permission: 'comments.manage' }))
      router
        .post('comments/:id/reply', [CommentsController, 'reply'])
        .use(middleware.acl({ permission: 'comments.manage' }))
      router
        .delete('comments/:id', [CommentsController, 'destroy'])
        .use(middleware.acl({ permission: 'comments.manage' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
