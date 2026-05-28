import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const SettingsController = () => import('#controllers/settings_controller')
const LlmProvidersController = () => import('#controllers/llm_providers_controller')
const GoogleAnalyticsController = () => import('#controllers/google_analytics_controller')
const GoogleSearchConsoleController = () => import('#controllers/google_search_console_controller')

export default function settingsRoutes() {
  // Public Settings
  router.get('settings/public', [SettingsController, 'getPublicSettings'])

  router
    .group(() => {
      router.get('settings/llm/models', [SettingsController, 'listLlmModels'])
      router.post('settings/llm/test', [SettingsController, 'testLlmConnection'])
      router.get('settings/llm/providers', [LlmProvidersController, 'index'])
      router.post('settings/llm/providers', [LlmProvidersController, 'store'])
      router.put('settings/llm/providers/:id', [LlmProvidersController, 'update'])
      router.delete('settings/llm/providers/:id', [LlmProvidersController, 'destroy'])
      router.post('settings/llm/providers/:id/test', [LlmProvidersController, 'testSavedProvider'])
      router.get('settings/:group', [SettingsController, 'showGroup'])
      router.put('settings/:group', [SettingsController, 'updateGroup'])
      router.post('settings/email/test', [SettingsController, 'sendTestEmail'])

      // Google Analytics
      router.get('google-analytics/dashboard', [GoogleAnalyticsController, 'getDashboard'])
      router.get('google-analytics/realtime', [GoogleAnalyticsController, 'getRealtime'])

      // Google Search Console
      router.get('google-search-console/dashboard', [GoogleSearchConsoleController, 'getDashboard'])
      router.get('google-search-console/auth-url', [GoogleSearchConsoleController, 'getAuthUrl'])
      router.post('google-search-console/disconnect', [GoogleSearchConsoleController, 'disconnect'])
      router.get('google-search-console/status', [GoogleSearchConsoleController, 'getStatus'])
    })
    .prefix('admin')
    .use(middleware.auth())
    .use(middleware.acl({ permission: 'settings.manage' }))
}
