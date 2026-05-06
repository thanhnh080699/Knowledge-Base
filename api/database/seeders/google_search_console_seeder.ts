import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Setting, { type SettingValue } from '#models/setting'

type DefaultSetting = {
  settingGroup: string
  settingKey: string
  settingValue: SettingValue
  type: 'string' | 'text' | 'email' | 'url' | 'boolean' | 'number' | 'select' | 'json'
  label: string
  description: string | null
  sortOrder: number
}

const googleSearchConsoleSettings: DefaultSetting[] = [
  {
    settingGroup: 'google_search_console',
    settingKey: 'google_search_console_enabled',
    settingValue: false,
    type: 'boolean',
    label: 'Enable Google Search Console',
    description: 'Whether to enable Google Search Console integration in the CMS.',
    sortOrder: 10,
  },
  {
    settingGroup: 'google_search_console',
    settingKey: 'google_search_console_site_url',
    settingValue: '',
    type: 'string',
    label: 'Site URL',
    description:
      'The site URL as registered in Google Search Console (e.g. https://thanhnh.id.vn or sc-domain:thanhnh.id.vn).',
    sortOrder: 20,
  },
  {
    settingGroup: 'google_search_console',
    settingKey: 'google_search_console_client_id',
    settingValue: '',
    type: 'string',
    label: 'OAuth2 Client ID',
    description: 'The Google OAuth2 Client ID from Google Cloud Console.',
    sortOrder: 30,
  },
  {
    settingGroup: 'google_search_console',
    settingKey: 'google_search_console_client_secret',
    settingValue: '',
    type: 'string',
    label: 'OAuth2 Client Secret',
    description: 'The Google OAuth2 Client Secret from Google Cloud Console.',
    sortOrder: 40,
  },
  {
    settingGroup: 'google_search_console',
    settingKey: 'google_search_console_refresh_token',
    settingValue: '',
    type: 'string',
    label: 'Refresh Token',
    description: 'OAuth2 refresh token (auto-filled after Google login).',
    sortOrder: 50,
  },
]

export default class GoogleSearchConsoleSeeder extends BaseSeeder {
  async run() {
    for (const setting of googleSearchConsoleSettings) {
      await Setting.updateOrCreate(
        {
          settingGroup: setting.settingGroup,
          settingKey: setting.settingKey,
        },
        setting
      )
    }

    console.log(`[GSC] Synced ${googleSearchConsoleSettings.length} settings`)
  }
}
