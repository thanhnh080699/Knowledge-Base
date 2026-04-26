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

const overviewSettings: DefaultSetting[] = [
  {
    settingGroup: 'overview',
    settingKey: 'site_name',
    settingValue: 'thanhnh.id.vn',
    type: 'string',
    label: 'Site name',
    description: 'Main website name displayed across public pages and metadata.',
    sortOrder: 10,
  },
  {
    settingGroup: 'overview',
    settingKey: 'site_description',
    settingValue: 'Knowledge base, portfolio and software services by Thanh Nguyen.',
    type: 'text',
    label: 'Site description',
    description: 'Short description used for SEO and interface summaries.',
    sortOrder: 20,
  },
  {
    settingGroup: 'overview',
    settingKey: 'site_url',
    settingValue: 'https://thanhnh.id.vn',
    type: 'url',
    label: 'Site URL',
    description: 'Canonical public URL for the website.',
    sortOrder: 30,
  },
  {
    settingGroup: 'overview',
    settingKey: 'admin_email',
    settingValue: 'admin@thanhnh.id.vn',
    type: 'email',
    label: 'Admin email',
    description: 'Primary address for system notifications and contact routing.',
    sortOrder: 40,
  },
  {
    settingGroup: 'overview',
    settingKey: 'timezone',
    settingValue: 'Asia/Ho_Chi_Minh',
    type: 'select',
    label: 'Timezone',
    description: 'Default timezone for publishing and administrative timestamps.',
    sortOrder: 50,
  },
  {
    settingGroup: 'overview',
    settingKey: 'date_format',
    settingValue: 'dd/MM/yyyy',
    type: 'select',
    label: 'Date format',
    description: 'Default display format for dates in the CMS and frontend.',
    sortOrder: 60,
  },
  {
    settingGroup: 'overview',
    settingKey: 'maintenance_mode',
    settingValue: false,
    type: 'boolean',
    label: 'Maintenance mode',
    description: 'Temporarily mark the public website as under maintenance.',
    sortOrder: 70,
  },
]

export default class SettingsSeeder extends BaseSeeder {
  async run() {
    for (const setting of overviewSettings) {
      await Setting.updateOrCreate(
        {
          settingGroup: setting.settingGroup,
          settingKey: setting.settingKey,
        },
        setting
      )
    }

    console.log(`[Settings] Synced ${overviewSettings.length} overview settings`)
  }
}
