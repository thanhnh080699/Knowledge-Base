# API Reference — AdonisJS v6 + Lucid ORM + MariaDB

## Tại sao AdonisJS v6 + Lucid?

Lucid ORM là ORM gốc của AdonisJS, không thể tách rời. AdonisJS v6 là full-featured TypeScript framework: tích hợp sẵn Lucid ORM, VineJS validator, Auth, Router, Middleware — không cần lắp ghép thủ công như Express. Lucid hỗ trợ MariaDB/MySQL đầy đủ, có Active Record pattern rõ ràng, migration & seeder được quản lý qua `node ace`.

---

## Khởi tạo dự án

```bash
npm init adonisjs@latest api -- --kit=api
cd api

# Cài Lucid + MariaDB driver
node ace add @adonisjs/lucid
# Khi được hỏi driver → chọn: mysql2  (tương thích MariaDB)

# Cài thêm
npm install slugify
```

> **Lưu ý**: `--kit=api` tạo project không có view engine (REST API thuần). Lucid, Auth, VineJS đã được tích hợp sẵn trong AdonisJS v6.

## Biến môi trường (.env)

```env
TZ=UTC
PORT=4000
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=                        # node ace generate:key

NODE_ENV=development

# MariaDB (Local Development)
DB_HOST=192.168.11.254
DB_PORT=3306
DB_USER=thanhnh
DB_PASSWORD=thanhnh
DB_DATABASE=thanhnh

# Auth
JWT_SECRET=your_jwt_secret
```

## Cấu hình MariaDB (config/database.ts)

```typescript
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql',           // MariaDB tương thích 'mysql'
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host:     env.get('DB_HOST'),
        port:     env.get('DB_PORT'),
        user:     env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: { naturalSort: true, paths: ['database/migrations'] },
      seeders:    { paths: ['database/seeders/main'] },
    },
  },
})

export default dbConfig
```

---

## Các lệnh `node ace` quan trọng

```bash
# App
node ace serve --hmr                          # Dev server với Hot Module Reload
node ace generate:key                         # Tạo APP_KEY

# Models & Migrations
node ace make:model Post -m                   # Tạo Model + Migration cùng lúc
node ace make:model Category -m
node ace make:model Tag -m
node ace make:model Series -m
node ace make:model Project -m
node ace make:model Service -m
node ace make:model ContactRequest -m
node ace make:model Newsletter -m

# Migrations
node ace migration:run                        # Apply tất cả migration pending
node ace migration:rollback                   # Rollback migration gần nhất
node ace migration:status                     # Xem trạng thái migration
node ace migration:fresh                      # Drop all + re-run (dev only)

# Pivot table (many-to-many, không cần Model)
node ace make:migration create_post_tags_table

# Controllers
node ace make:controller posts --resource     # CRUD controller
node ace make:controller categories --resource
node ace make:controller projects --resource
node ace make:controller services --resource
node ace make:controller contacts
node ace make:controller newsletter

# Seeders
node ace make:seeder Category
node ace db:seed                              # Chạy tất cả seeder
node ace db:seed --files="database/seeders/category_seeder.ts"

# Middleware
node ace make:middleware auth
node ace make:middleware rate_limit

# Testing
node ace test                                 # Japa test runner
```

---

## Lucid Migrations

### Categories

```typescript
// database/migrations/TIMESTAMP_create_categories_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().defaultTo(this.db.rawQuery('UUID()').knexQuery)
      table.string('name', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('description').nullable()
      table.string('icon', 100).nullable()
      table.string('color', 20).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Posts

```typescript
// database/migrations/TIMESTAMP_create_posts_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().defaultTo(this.db.rawQuery('UUID()').knexQuery)
      table.string('title', 500).notNullable()
      table.string('slug', 500).notNullable().unique()
      table.text('excerpt').nullable()
      table.text('content').notNullable()
      table.string('cover_image', 1000).nullable()
      table.enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED']).defaultTo('DRAFT').notNullable()
      table.integer('views').unsigned().defaultTo(0).notNullable()
      table.string('category_id', 36).notNullable().references('id').inTable('categories').onDelete('RESTRICT')
      table.string('series_id', 36).nullable().references('id').inTable('series').onDelete('SET NULL')
      table.timestamp('published_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('deleted_at').nullable()    // Soft delete

      table.index(['slug'])
      table.index(['status'])
      table.index(['category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Post Tags (Pivot)

```typescript
// database/migrations/TIMESTAMP_create_post_tags_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('post_id', 36).notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.string('tag_id',  36).notNullable().references('id').inTable('tags').onDelete('CASCADE')
      table.primary(['post_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Projects

```typescript
// database/migrations/TIMESTAMP_create_projects_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().defaultTo(this.db.rawQuery('UUID()').knexQuery)
      table.string('title', 500).notNullable()
      table.string('slug', 500).notNullable().unique()
      table.text('description').notNullable()
      table.text('long_desc').nullable()
      table.text('tech_stack').notNullable().defaultTo('[]')
      table.string('thumbnail_url', 1000).nullable()
      table.string('demo_url', 1000).nullable()
      table.string('repo_url', 1000).nullable()
      table.boolean('featured').defaultTo(false).notNullable()
      table.enum('status', ['ACTIVE', 'ARCHIVED']).defaultTo('ACTIVE').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Services

```typescript
// database/migrations/TIMESTAMP_create_services_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().defaultTo(this.db.rawQuery('UUID()').knexQuery)
      table.string('name', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('description').notNullable()
      table.text('features').notNullable().defaultTo('[]')
      table.string('price_range', 100).nullable()
      table.string('category', 100).notNullable()
      table.boolean('featured').defaultTo(false).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Contact Requests

```typescript
// database/migrations/TIMESTAMP_create_contact_requests_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().defaultTo(this.db.rawQuery('UUID()').knexQuery)
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('company', 255).nullable()
      table.text('message').notNullable()
      table.string('service_id', 36).nullable().references('id').inTable('services').onDelete('SET NULL')
      table.enum('status', ['PENDING', 'REPLIED', 'CLOSED']).defaultTo('PENDING').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

---

## Lucid Models (Active Record)

### Post Model

```typescript
// app/models/post.ts
import { DateTime } from 'luxon'
import {
  BaseModel, column, belongsTo, manyToMany, beforeCreate, scope
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Category from './category.js'
import Tag      from './tag.js'
import Series   from './series.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare excerpt: string | null

  @column()
  declare content: string

  @column()
  declare coverImage: string | null

  @column()
  declare status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

  @column()
  declare views: number

  @column()
  declare categoryId: string

  @column()
  declare seriesId: string | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  // ── Relations
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Series)
  declare series: BelongsTo<typeof Series>

  @manyToMany(() => Tag, {
    pivotTable: 'post_tags',
    pivotForeignKey: 'post_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  // ── Hooks
  @beforeCreate()
  static assignUuid(post: Post) {
    post.id = randomUUID()
  }

  // ── Scopes
  static published = scope((query) => {
    query.where('status', 'PUBLISHED').whereNull('deleted_at')
  })
}
```

### Project Model

```typescript
// app/models/project.ts
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare longDesc: string | null

  // Serialize/deserialize JSON ↔ string[]
  @column({
    prepare: (v: string[]) => JSON.stringify(v),
    consume: (v: string)   => JSON.parse(v),
  })
  declare techStack: string[]

  @column()
  declare thumbnailUrl: string | null

  @column()
  declare demoUrl: string | null

  @column()
  declare repoUrl: string | null

  @column()
  declare featured: boolean

  @column()
  declare status: 'ACTIVE' | 'ARCHIVED'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(project: Project) {
    project.id = randomUUID()
  }
}
```

> **JSON Array fields trên MariaDB:** Dùng Lucid `column({ prepare, consume })` để tự động serialize/deserialize. `prepare` chạy khi ghi vào DB, `consume` chạy khi đọc từ DB.

---

## Controllers

```typescript
// app/controllers/posts_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'

export default class PostsController {
  // GET /api/posts
  async index({ request, response }: HttpContext) {
    const page  = request.input('page', 1)
    const limit = request.input('limit', 20)
    const categorySlug = request.input('category')
    const tag          = request.input('tag')

    const query = Post.query()
      .withScopes((s) => s.published())
      .preload('category')
      .preload('tags')
      .orderBy('published_at', 'desc')

    if (categorySlug) {
      query.whereHas('category', (q) => q.where('slug', categorySlug))
    }
    if (tag) {
      query.whereHas('tags', (q) => q.where('slug', tag))
    }

    const posts = await query.paginate(page, limit)
    return response.ok(posts)
  }

  // GET /api/posts/:slug
  async show({ params, response }: HttpContext) {
    const post = await Post.query()
      .where('slug', params.slug)
      .whereNull('deleted_at')
      .preload('category')
      .preload('tags')
      .preload('series')
      .firstOrFail()

    await post.merge({ views: post.views + 1 }).save()
    return response.ok({ data: post })
  }

  // POST /api/admin/posts
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const post    = await Post.create(payload)
    return response.created({ data: post })
  }

  // PUT /api/admin/posts/:id
  async update({ params, request, response }: HttpContext) {
    const post    = await Post.findOrFail(params.id)
    const payload = await request.validateUsing(updatePostValidator)
    await post.merge(payload).save()
    return response.ok({ data: post })
  }

  // DELETE /api/admin/posts/:id  (soft delete)
  async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.merge({ deletedAt: new Date() }).save()
    return response.noContent()
  }
}
```

---

## Validators (VineJS)

```typescript
// app/validators/post.ts
import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title:      vine.string().trim().minLength(3).maxLength(500),
    slug:       vine.string().trim().regex(/^[a-z0-9-]+$/).optional(),
    excerpt:    vine.string().trim().maxLength(500).optional(),
    content:    vine.string().trim().minLength(1),
    coverImage: vine.string().url().optional(),
    status:     vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    categoryId: vine.string().uuid(),
    seriesId:   vine.string().uuid().optional(),
    tagIds:     vine.array(vine.string().uuid()).optional(),
    publishedAt: vine.date().optional(),
  })
)

export const updatePostValidator = vine.compile(
  vine.object({
    title:      vine.string().trim().minLength(3).maxLength(500).optional(),
    excerpt:    vine.string().trim().maxLength(500).optional(),
    content:    vine.string().trim().optional(),
    coverImage: vine.string().url().optional(),
    status:     vine.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    categoryId: vine.string().uuid().optional(),
    tagIds:     vine.array(vine.string().uuid()).optional(),
  })
)
```

---

## Routes (start/routes.ts)

```typescript
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PostsController       = () => import('#controllers/posts_controller')
const CategoriesController  = () => import('#controllers/categories_controller')
const ProjectsController    = () => import('#controllers/projects_controller')
const ServicesController    = () => import('#controllers/services_controller')
const ContactsController    = () => import('#controllers/contacts_controller')
const NewsletterController  = () => import('#controllers/newsletter_controller')

// ── Public
router.group(() => {
  router.resource('posts',      PostsController).only(['index', 'show'])
  router.resource('categories', CategoriesController).only(['index', 'show'])
  router.resource('projects',   ProjectsController).only(['index', 'show'])
  router.resource('services',   ServicesController).only(['index', 'show'])
  router.post('contacts',       [ContactsController, 'store'])
  router.post('newsletter',     [NewsletterController, 'subscribe'])
}).prefix('/api')

// ── Admin (JWT protected)
router.group(() => {
  router.resource('posts',      PostsController).except(['index', 'show'])
  router.resource('categories', CategoriesController).except(['index', 'show'])
  router.resource('projects',   ProjectsController).except(['index', 'show'])
  router.resource('services',   ServicesController).except(['index', 'show'])
  router.resource('contacts',   ContactsController).only(['index', 'update'])
}).prefix('/api/admin').use(middleware.auth())
```

---

## Seeders

```typescript
// database/seeders/main/index.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IndexSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    await new (await import('../category_seeder.js')).default(this.client).run()
    await new (await import('../tag_seeder.js')).default(this.client).run()
  }
}
```

```typescript
// database/seeders/category_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class CategorySeeder extends BaseSeeder {
  async run() {
    await Category.createManyOrFail([
      { name: 'System Admin', slug: 'sysadmin',    color: '#3B82F6', icon: 'server' },
      { name: 'DevOps',       slug: 'devops',      color: '#10B981', icon: 'git-branch' },
      { name: 'Development',  slug: 'development', color: '#8B5CF6', icon: 'code-2' },
      { name: 'Tools',        slug: 'tools',       color: '#F59E0B', icon: 'wrench' },
      { name: 'Security',     slug: 'security',    color: '#EF4444', icon: 'shield' },
    ])
  }
}
```

---

## Quy trình tạo Entity mới (Full-stack)

1. `node ace make:model <Name> -m` → tạo Model + Migration
2. Viết migration (`up()` / `down()`) — trường mới luôn trước timestamp
3. `node ace migration:run`
4. Định nghĩa columns, relations, hooks, scopes trong Model
5. Tạo Validator (`app/validators/<entity>.ts`) với VineJS
6. `node ace make:controller <Name>sController --resource`
7. Đăng ký route trong `start/routes.ts`
8. Viết test trong `tests/functional/<entity>.spec.ts`

---

## Migration từ WordPress

### Scripts transform

```
api/scripts/
├── parse-wp-xml.ts    # xml2js parse WP export XML
├── transform-posts.ts # Map WP fields → AdonisJS model payload
└── seed-from-wp.ts    # Post.createMany() / Post.updateOrCreate()
```

```typescript
// Sync many-to-many tags sau khi import post
await post.related('tags').sync(resolvedTagIds)
```
