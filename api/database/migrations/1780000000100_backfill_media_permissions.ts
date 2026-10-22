import { BaseSchema } from '@adonisjs/lucid/schema'
import { ACL_MODULES, getPermissionName, getPermissionSlug } from '#helpers/acl'

export default class extends BaseSchema {
  async up() {
    // Existing installations may have added the media routes without rerunning
    // the ACL seeder. Backfill only missing records; preserve custom role grants.
    this.defer(async (db) => {
      const admin = await db.from('roles').where('slug', 'admin').whereNull('deleted_at').first()
      for (const action of ACL_MODULES.MEDIA.permissions) {
        const slug = getPermissionSlug('MEDIA', action)
        let permission = await db.from('permissions').where('slug', slug).first()
        if (permission) continue

        await db.table('permissions').insert({
          slug,
          name: getPermissionName(ACL_MODULES.MEDIA.name, action),
          module: ACL_MODULES.MEDIA.name,
          created_at: new Date(),
          updated_at: new Date(),
        })
        permission = await db.from('permissions').where('slug', slug).firstOrFail()
        if (admin) {
          await db.table('permission_roles').insert({ role_id: admin.id, permission_id: permission.id })
        }
      }
    })
  }

  async down() {
    // Retain permissions and grants: they may already be used by live tokens.
    // A source rollback must not revoke access or delete application data.
  }
}
