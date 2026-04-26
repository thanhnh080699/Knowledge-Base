import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SettingsController = () => import('#controllers/settings_controller')
const GoogleAnalyticsController = () => import('#controllers/google_analytics_controller')

export default function settingsRoutes() {
  // Public Settings
  router.get('settings/public', [SettingsController, 'getPublicSettings'])

  router
    .group(() => {
      router.get('settings/:group', [SettingsController, 'showGroup'])
      router.put('settings/:group', [SettingsController, 'updateGroup'])
      router.post('settings/email/test', [SettingsController, 'sendTestEmail'])

      // Google Analytics
      router.get('google-analytics/dashboard', [GoogleAnalyticsController, 'getDashboard'])
      router.get('google-analytics/realtime', [GoogleAnalyticsController, 'getRealtime'])
    })
    .prefix('admin')
    .use(middleware.auth())
    .use(middleware.acl({ permission: 'settings.manage' }))
}
