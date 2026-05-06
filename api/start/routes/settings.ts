import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SettingsController = () => import('#controllers/settings_controller')
const GoogleAnalyticsController = () => import('#controllers/google_analytics_controller')
const GoogleSearchConsoleController = () =>
  import('#controllers/google_search_console_controller')

export default function settingsRoutes() {
  // Public Settings
  router.get('settings/public', [SettingsController, 'getPublicSettings'])

  // Google Search Console OAuth2 callback (public — Google redirects browser here)
  router.get('admin/google-search-console/callback', [
    GoogleSearchConsoleController,
    'handleCallback',
  ])

  router
    .group(() => {
      router.get('settings/:group', [SettingsController, 'showGroup'])
      router.put('settings/:group', [SettingsController, 'updateGroup'])
      router.post('settings/email/test', [SettingsController, 'sendTestEmail'])

      // Google Analytics
      router.get('google-analytics/dashboard', [GoogleAnalyticsController, 'getDashboard'])
      router.get('google-analytics/realtime', [GoogleAnalyticsController, 'getRealtime'])

      // Google Search Console
      router.get('google-search-console/dashboard', [
        GoogleSearchConsoleController,
        'getDashboard',
      ])
      router.get('google-search-console/auth-url', [
        GoogleSearchConsoleController,
        'getAuthUrl',
      ])
      router.post('google-search-console/disconnect', [
        GoogleSearchConsoleController,
        'disconnect',
      ])
      router.get('google-search-console/status', [
        GoogleSearchConsoleController,
        'getStatus',
      ])
    })
    .prefix('admin')
    .use(middleware.auth())
    .use(middleware.acl({ permission: 'settings.manage' }))
}
