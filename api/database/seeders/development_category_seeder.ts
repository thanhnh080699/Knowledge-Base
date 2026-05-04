import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.updateOrCreate(
      { slug: 'development' },
      {
        name: 'Development',
        description: 'Backend, Frontend, kiến trúc ứng dụng và các framework hiện đại.',
        sortOrder: 4,
      }
    )
  }
}
