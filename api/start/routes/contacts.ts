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
    router.put('contact-requests/:id', [ContactsController, 'updateRequest'])
    router.delete('contact-requests/:id', [ContactsController, 'destroyRequest'])
      .use(middleware.acl({ permission: 'contacts.manage' }))

    router.get('newsletters', [ContactsController, 'indexNewsletters'])
    router.delete('newsletters/:id', [ContactsController, 'destroyNewsletter'])
      .use(middleware.acl({ permission: 'newsletters.manage' }))
  }).prefix('admin').use(middleware.auth())
}
