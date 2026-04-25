import { BaseCommand } from '@adonisjs/core/ace'
import User from '#models/user'

export default class FixAdmin extends BaseCommand {
  static commandName = 'fix:admin'
  static description = 'Fix password for admin'

  static options = {
    startApp: true,
  }

  async run() {
    const user = await User.findBy('email', 'admin@gmail.com')
    if (user) {
      user.password = '123456'
      await user.save()
      this.logger.success('Fixed password for admin@gmail.com')
    } else {
      this.logger.error('User not found')
    }
  }
}
