import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Menu from '#models/menu'
import MenuItem from '#models/menu_item'

type SeedMenuItem = {
  key: string
  parentKey?: string
  title: string
  url: string
  cssClass?: string
  sortOrder: number
}

type SeedMenu = {
  name: string
  slug: string
  description: string
  location: string
  isDefault?: boolean
  items: SeedMenuItem[]
}

const menus: SeedMenu[] = [
  {
    name: 'Header Navigation',
    slug: 'header-navigation',
    description: 'Primary frontend navigation displayed in the public site header.',
    location: 'header',
    isDefault: true,
    items: [
      { key: 'docs', title: 'Tài liệu', url: '/docs', cssClass: 'book-open', sortOrder: 0 },
      { key: 'tools', title: 'Tools', url: '/tools', cssClass: 'wrench', sortOrder: 1 },
      { key: 'projects', title: 'Dự án', url: '/projects', cssClass: 'code-2', sortOrder: 2 },
      {
        key: 'portfolio',
        title: 'About Me',
        url: '/portfolio',
        cssClass: 'briefcase-business',
        sortOrder: 3,
      },
      { key: 'contact', title: 'Liên hệ', url: '/contact', cssClass: 'mail', sortOrder: 4 },
    ],
  },
  {
    name: 'Footer Documentation',
    slug: 'footer-documentation',
    description: 'Documentation links displayed in the public site footer.',
    location: 'footer',
    items: [
      { key: 'docs', title: 'Tài liệu kỹ thuật', url: '/docs', sortOrder: 0 },
      {
        key: 'sysadmin',
        title: 'Systems Administration',
        url: '/docs?category=sysadmin',
        sortOrder: 1,
      },
      { key: 'devops', title: 'DevOps', url: '/docs?category=devops', sortOrder: 2 },
      { key: 'helpdesk', title: 'Helpdesk', url: '/docs?category=helpdesk', sortOrder: 3 },
    ],
  },
  {
    name: 'Footer Explore',
    slug: 'footer-explore',
    description: 'Explore links displayed in the public site footer.',
    location: 'footer',
    items: [
      { key: 'projects', title: 'Dự án', url: '/projects', sortOrder: 0 },
      { key: 'portfolio', title: 'About Me', url: '/portfolio', sortOrder: 1 },
      { key: 'contact', title: 'Liên hệ', url: '/contact', sortOrder: 2 },
    ],
  },
]

export default class MenusSeeder extends BaseSeeder {
  async run() {
    for (const seedMenu of menus) {
      const menu = await Menu.updateOrCreate(
        { slug: seedMenu.slug },
        {
          name: seedMenu.name,
          description: seedMenu.description,
          location: seedMenu.location,
          isDefault: seedMenu.isDefault ?? false,
          deletedAt: null,
        }
      )

      if (seedMenu.isDefault) {
        await Menu.query().whereNot('id', menu.id).where('is_default', true).update({
          is_default: false,
        })
      }

      await MenuItem.query().where('menu_id', menu.id).delete()

      const idByKey = new Map<string, number>()

      for (const item of seedMenu.items) {
        const created = await MenuItem.create({
          menuId: menu.id,
          parentId: null,
          title: item.title,
          url: item.url,
          type: 'CUSTOM',
          referenceId: null,
          target: '_self',
          cssClass: item.cssClass ?? null,
          rel: null,
          sortOrder: item.sortOrder,
        })

        idByKey.set(item.key, created.id)
      }

      for (const item of seedMenu.items) {
        if (!item.parentKey) continue

        const createdId = idByKey.get(item.key)
        const parentId = idByKey.get(item.parentKey)
        if (!createdId || !parentId) continue

        const created = await MenuItem.findOrFail(createdId)
        created.parentId = parentId
        await created.save()
      }
    }
  }
}
