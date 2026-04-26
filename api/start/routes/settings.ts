import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SettingsController = () => import('#controllers/settings_controller')

export default function settingsRoutes() {
  router
    .group(() => {
      router.get('settings/:group', [SettingsController, 'showGroup'])
      router.put('settings/:group', [SettingsController, 'updateGroup'])
    })
    .prefix('admin')
    .use(middleware.auth())
    .use(middleware.acl({ permission: 'settings.manage' }))
}
