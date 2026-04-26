import nodemailer from 'nodemailer'
import Setting, { type SettingValue } from '#models/setting'

type EmailSettings = {
  mailer: string
  host: string
  port: number
  username: string
  password: string
  encryption: string
  fromAddress: string
  fromName: string
  replyTo: string
}

function valueToString(value: SettingValue, fallback = '') {
  if (value === null || value === undefined) {
    return fallback
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return fallback
}

function valueToNumber(value: SettingValue, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export default class EmailService {
  private async getSettings() {
    const settings = await Setting.query().where('setting_group', 'email')
    const values = settings.reduce<Record<string, SettingValue>>((carry, setting) => {
      carry[setting.settingKey] = setting.settingValue
      return carry
    }, {})

    return {
      mailer: valueToString(values.mailer, 'smtp'),
      host: valueToString(values.smtp_host),
      port: valueToNumber(values.smtp_port, 587),
      username: valueToString(values.smtp_username),
      password: valueToString(values.smtp_password),
      encryption: valueToString(values.smtp_encryption, 'tls'),
      fromAddress: valueToString(values.from_address),
      fromName: valueToString(values.from_name, 'ThanhNh CMS'),
      replyTo: valueToString(values.reply_to),
    }
  }

  private validateSettings(settings: EmailSettings) {
    if (settings.mailer !== 'smtp') {
      throw new Error('Only SMTP mailer is supported')
    }

    if (!settings.host || !settings.port || !settings.fromAddress) {
      throw new Error('SMTP host, port and from address are required')
    }
  }

  async sendTestEmail(recipient: string) {
    const settings = await this.getSettings()
    this.validateSettings(settings)

    const secure = settings.encryption === 'ssl' || settings.port === 465
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure,
      auth:
        settings.username || settings.password
          ? { user: settings.username, pass: settings.password }
          : undefined,
      requireTLS: settings.encryption === 'tls',
    })

    const info = await transporter.sendMail({
      to: recipient,
      from: {
        address: settings.fromAddress,
        name: settings.fromName,
      },
      replyTo: settings.replyTo || undefined,
      subject: 'Test email from ThanhNh CMS',
      text: 'This is a test email sent from the CMS email settings page.',
      html: '<p>This is a test email sent from the CMS email settings page.</p>',
    })

    return {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    }
  }
}
