import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const QuestionAnswersController = () => import('#controllers/question_answers_controller')

export default function questionAnswersRoutes() {
  // Public
  router
    .get('posts/:postId/question-answers', [QuestionAnswersController, 'publicForPost'])
    .as('questionAnswers.public.forPost')
  router
    .get('question-answers', [QuestionAnswersController, 'publicIndex'])
    .as('questionAnswers.public.index')

  // Admin
  router
    .group(() => {
      router
        .resource('question-answers', QuestionAnswersController)
        .use('*', middleware.acl({ permission: 'question_answers.manage' }))
    })
    .prefix('admin')
    .use(middleware.auth())
}
