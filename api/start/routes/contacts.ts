import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ContactsController = () => import('#controllers/contacts_controller')

export default function contactsRoutes() {
  // Public
  router.post('contact', [ContactsController, 'storeRequest'])
  router.post('newsletter', [ContactsController, 'subscribeNewsletter'])

  // Admin
  router.group(() => {
    router.get('contact-requests', [ContactsController, 'indexRequests'])
      .use(middleware.acl({ permission: 'contacts.manage' }))
    router.get('newsletters', [ContactsController, 'indexNewsletters'])
      .use(middleware.acl({ permission: 'newsletters.manage' }))
  }).prefix('admin').use(middleware.auth())
}
