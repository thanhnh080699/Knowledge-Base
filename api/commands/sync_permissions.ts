import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Permission from '#models/permission'
import Role from '#models/role'
import { ACL_MODULES, getPermissionName, getPermissionSlug } from '#helpers/acl'

export default class SyncPermissions extends BaseCommand {
  static commandName = 'sync:permissions'
  static description = 'Sync predefined permissions from code to database'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Syncing permissions...')

    let updatedCount = 0

    for (const [moduleKey, moduleConfig] of Object.entries(ACL_MODULES)) {
      for (const action of moduleConfig.permissions) {
        const slug = getPermissionSlug(moduleKey, action)
        const name = getPermissionName(moduleConfig.name, action)

        const permission = await Permission.updateOrCreate(
          { slug },
          {
            name,
            module: moduleConfig.name,
            deletedAt: null, // Ensure it's not soft-deleted
          }
        )

        this.logger.action(`Synced: ${permission.slug}`).succeeded()
        updatedCount++
      }
    }

    // 2. Assign all permissions to Admin role
    const adminRole = await Role.findBy('slug', 'admin')
    if (adminRole) {
      const allPermissions = await Permission.all()
      await adminRole.related('permissions').sync(allPermissions.map((p) => p.id))
      this.logger.success('Assigned all permissions to Administrator role')
    }

    this.logger.success(`Sync complete! Total permissions: ${updatedCount}`)
  }
}
