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

const emailSettings: DefaultSetting[] = [
  {
    settingGroup: 'email',
    settingKey: 'mailer',
    settingValue: 'smtp',
    type: 'select',
    label: 'Mailer',
    description: 'Email delivery driver used by the API.',
    sortOrder: 10,
  },
  {
    settingGroup: 'email',
    settingKey: 'smtp_host',
    settingValue: '',
    type: 'string',
    label: 'SMTP host',
    description: 'SMTP server hostname.',
    sortOrder: 20,
  },
  {
    settingGroup: 'email',
    settingKey: 'smtp_port',
    settingValue: 587,
    type: 'number',
    label: 'SMTP port',
    description: 'SMTP server port. Common values are 587 for TLS and 465 for SSL.',
    sortOrder: 30,
  },
  {
    settingGroup: 'email',
    settingKey: 'smtp_username',
    settingValue: '',
    type: 'string',
    label: 'SMTP username',
    description: 'SMTP account username.',
    sortOrder: 40,
  },
  {
    settingGroup: 'email',
    settingKey: 'smtp_password',
    settingValue: '',
    type: 'string',
    label: 'SMTP password',
    description: 'SMTP account password or app password.',
    sortOrder: 50,
  },
  {
    settingGroup: 'email',
    settingKey: 'smtp_encryption',
    settingValue: 'tls',
    type: 'select',
    label: 'Encryption',
    description: 'Connection security used by the SMTP server.',
    sortOrder: 60,
  },
  {
    settingGroup: 'email',
    settingKey: 'from_address',
    settingValue: 'admin@thanhnh.id.vn',
    type: 'email',
    label: 'From address',
    description: 'Sender email address displayed to recipients.',
    sortOrder: 70,
  },
  {
    settingGroup: 'email',
    settingKey: 'from_name',
    settingValue: 'ThanhNh CMS',
    type: 'string',
    label: 'From name',
    description: 'Sender name displayed to recipients.',
    sortOrder: 80,
  },
  {
    settingGroup: 'email',
    settingKey: 'reply_to',
    settingValue: '',
    type: 'email',
    label: 'Reply-to address',
    description: 'Optional reply-to email address.',
    sortOrder: 90,
  },
]

export default class SettingsSeeder extends BaseSeeder {
  async run() {
    const settings = [...overviewSettings, ...emailSettings]

    for (const setting of settings) {
      await Setting.updateOrCreate(
        {
          settingGroup: setting.settingGroup,
          settingKey: setting.settingKey,
        },
        setting
      )
    }

    console.log(`[Settings] Synced ${settings.length} settings`)
  }
}
