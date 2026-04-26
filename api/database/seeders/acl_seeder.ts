import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Permission from '#models/permission'
import User from '#models/user'
import { ACL_MODULES, getPermissionName, getPermissionSlug } from '#helpers/acl'

export default class AclSeeder extends BaseSeeder {
  async run() {
    // 1. Sync Permissions from code (ACL_MODULES helper)
    const permissionsToSync: { name: string; slug: string; module: string }[] = []

    for (const [moduleKey, moduleConfig] of Object.entries(ACL_MODULES)) {
      for (const action of moduleConfig.permissions) {
        permissionsToSync.push({
          slug: getPermissionSlug(moduleKey, action),
          name: getPermissionName(moduleConfig.name, action),
          module: moduleConfig.name,
        })
      }
    }

    // Update or create permissions
    let syncedCount = 0
    for (const p of permissionsToSync) {
      await Permission.updateOrCreate(
        { slug: p.slug },
        {
          name: p.name,
          module: p.module,
          deletedAt: null,
        }
      )
      syncedCount++
    }
    console.log(`[ACL] Synced ${syncedCount} permissions`)

    const allPermissions = await Permission.all()

    // 2. Create/Update Roles
    const adminRole = await Role.updateOrCreate(
      { slug: 'admin' },
      {
        name: 'Administrator',
        description: 'Full access to all modules',
        deletedAt: null,
      }
    )

    const editorRole = await Role.updateOrCreate(
      { slug: 'editor' },
      {
        name: 'Editor',
        description: 'Manage content modules only',
        deletedAt: null,
      }
    )
    console.log(`[ACL] Roles created/updated: Admin, Editor`)

    // 3. Assign all permissions to Admin
    await adminRole.related('permissions').sync(allPermissions.map((p) => p.id))

    // 4. Assign content permissions to Editor
    const contentPermissions = allPermissions.filter((p) =>
      ['Posts', 'Categories', 'Tags', 'Projects', 'Services'].includes(p.module)
    )
    await editorRole.related('permissions').sync(contentPermissions.map((p) => p.id))
    console.log(`[ACL] Permissions assigned to roles`)

    // 5. Clone make:admin logic - Create a default admin user if none exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thanhnh.id.vn'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'
    const adminFullName = process.env.ADMIN_FULL_NAME || 'Administrator'

    const existingAdmin = await User.findBy('email', adminEmail)
    if (!existingAdmin) {
      const user = new User()
      user.fullName = adminFullName
      user.email = adminEmail
      user.password = adminPassword
      user.status = 'active'
      await user.save()

      // Assign Admin Role
      await user.related('roles').attach([adminRole.id])
      console.log(`[ACL] Created default admin user: ${adminEmail}`)
    } else {
      // Ensure existing admin has the role
      const hasRole = await existingAdmin.related('roles').query().where('slug', 'admin').first()
      if (!hasRole) {
        await existingAdmin.related('roles').attach([adminRole.id])
      }
      console.log(`[ACL] Admin user already exists: ${adminEmail}`)
    }
  }
}
