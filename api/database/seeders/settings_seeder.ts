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

const contactSettings: DefaultSetting[] = [
  {
    settingGroup: 'contact',
    settingKey: 'contact_name',
    settingValue: 'Thanh Nguyen',
    type: 'string',
    label: 'Contact name',
    description: 'Name of the contact person or entity.',
    sortOrder: 10,
  },
  {
    settingGroup: 'contact',
    settingKey: 'contact_email',
    settingValue: 'contact@thanhnh.id.vn',
    type: 'email',
    label: 'Contact email',
    description: 'Primary email address for business inquiries.',
    sortOrder: 20,
  },
  {
    settingGroup: 'contact',
    settingKey: 'contact_phone',
    settingValue: '',
    type: 'string',
    label: 'Contact phone',
    description: 'Primary phone number for business inquiries.',
    sortOrder: 30,
  },
  {
    settingGroup: 'contact',
    settingKey: 'contact_address',
    settingValue: 'Ho Chi Minh City, Vietnam',
    type: 'text',
    label: 'Contact address',
    description: 'Physical or mailing address.',
    sortOrder: 40,
  },
  {
    settingGroup: 'contact',
    settingKey: 'working_hours',
    settingValue: 'Mon - Fri: 08:00 - 18:00',
    type: 'text',
    label: 'Working hours',
    description: 'Business hours or availability.',
    sortOrder: 50,
  },
  {
    settingGroup: 'contact',
    settingKey: 'social_facebook',
    settingValue: '',
    type: 'url',
    label: 'Facebook URL',
    description: 'Link to your Facebook profile or page.',
    sortOrder: 60,
  },
  {
    settingGroup: 'contact',
    settingKey: 'social_twitter',
    settingValue: '',
    type: 'url',
    label: 'Twitter (X) URL',
    description: 'Link to your Twitter profile.',
    sortOrder: 70,
  },
  {
    settingGroup: 'contact',
    settingKey: 'social_linkedin',
    settingValue: '',
    type: 'url',
    label: 'LinkedIn URL',
    description: 'Link to your LinkedIn profile.',
    sortOrder: 80,
  },
  {
    settingGroup: 'contact',
    settingKey: 'social_github',
    settingValue: 'https://github.com/thanhnh080699',
    type: 'url',
    label: 'GitHub URL',
    description: 'Link to your GitHub profile.',
    sortOrder: 90,
  },
  {
    settingGroup: 'contact',
    settingKey: 'social_youtube',
    settingValue: '',
    type: 'url',
    label: 'YouTube URL',
    description: 'Link to your YouTube channel.',
    sortOrder: 100,
  },
  {
    settingGroup: 'contact',
    settingKey: 'social_instagram',
    settingValue: '',
    type: 'url',
    label: 'Instagram URL',
    description: 'Link to your Instagram profile.',
    sortOrder: 110,
  },
]

export default class SettingsSeeder extends BaseSeeder {
  async run() {
    const settings = [...overviewSettings, ...emailSettings, ...contactSettings]

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
