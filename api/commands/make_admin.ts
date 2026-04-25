import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import Role from '#models/role'

export default class MakeAdmin extends BaseCommand {
  static commandName = 'make:admin'
  static description = 'Create a new administrator user'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const fullName = await this.prompt.ask('Enter full name')
    const email = await this.prompt.ask('Enter email address', {
      validate: (value) => {
        if (!value || !value.includes('@')) {
          return 'Please enter a valid email address'
        }
        return true
      },
    })
    const password = await this.prompt.secure('Enter password')

    try {
      // 1. Ensure Admin role exists
      const adminRole = await Role.updateOrCreate(
        { slug: 'admin' },
        {
          name: 'Administrator',
          description: 'Full access to all modules',
        }
      )

      // 2. Create User
      const user = new User()
      user.fullName = fullName
      user.email = email
      user.password = password
      await user.save()

      // 3. Assign Role
      await user.related('roles').attach([adminRole.id])

      this.logger.success(`Administrator ${fullName} (${email}) created successfully!`)
    } catch (error) {
      this.logger.error('Failed to create administrator')
      this.logger.error(error instanceof Error ? error.message : 'Unknown error')
    }
  }
}
