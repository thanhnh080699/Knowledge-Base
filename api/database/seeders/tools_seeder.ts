import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tool from '#models/tool'

export default class extends BaseSeeder {
  async run() {
    const tools = [
      // Category: Cron & Date Convert
      {
        slug: 'cron-builder',
        name: 'Cron Expression Builder',
        description: 'Build and understand cron expressions with human-readable descriptions',
        category: 'Cron & Date Convert',
        urlPath: '/tools/cron-builder',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 1,
      },
      {
        slug: 'timestamp-converter',
        name: 'Unix Timestamp Converter',
        description: 'Convert between Unix timestamps and datetime',
        category: 'Cron & Date Convert',
        urlPath: '/tools/timestamp-converter',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 2,
      },
      {
        slug: 'date-formatter',
        name: 'Date Formatter',
        description: 'Format date and time to various standard formats',
        category: 'Cron & Date Convert',
        urlPath: '/tools/date-formatter',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 3,
      },

      // Category: Crypto
      {
        slug: 'crypto-token-generator',
        name: 'Token Generator',
        description: 'Generate random tokens with uppercase, lowercase, numbers, and symbols',
        category: 'Crypto',
        urlPath: '/tools/crypto-token-generator',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 4,
      },
      {
        slug: 'crypto-password-generator',
        name: 'Password Generator',
        description: 'Generate secure passwords with strength score',
        category: 'Crypto',
        urlPath: '/tools/crypto-password-generator',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 5,
      },
      {
        slug: 'uuid-generator',
        name: 'UUID Generator',
        description: 'Generate random UUID v4 identifiers',
        category: 'Crypto',
        urlPath: '/tools/uuid-generator',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 6,
      },
      {
        slug: 'crypto-hash-text',
        name: 'Hash Text',
        description: 'Generate SHA hashes with hex or base64 encoding',
        category: 'Crypto',
        urlPath: '/tools/crypto-hash-text',
        featured: false,
        status: 'PUBLISHED' as const,
        sortOrder: 7,
      },

      // Category: Developer
      {
        slug: 'sql-formatter',
        name: 'SQL Prettify & Format',
        description: 'Format and beautify your SQL queries',
        category: 'Developer',
        urlPath: '/tools/sql-formatter',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 8,
      },
      {
        slug: 'xml-formatter',
        name: 'XML Formatter',
        description: 'Format and minify XML data',
        category: 'Developer',
        urlPath: '/tools/xml-formatter',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 9,
      },
      {
        slug: 'chmod-calculator',
        name: 'Chmod Calculator',
        description: 'Calculate Linux file permissions in octal and symbolic formats',
        category: 'Developer',
        urlPath: '/tools/chmod-calculator',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 10,
      },
      {
        slug: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format and validate JSON data',
        category: 'Developer',
        urlPath: '/tools/json-formatter',
        featured: true,
        status: 'PUBLISHED' as const,
        sortOrder: 11,
      },

      // Category: Encoder
      {
        slug: 'base64-encoder-decoder',
        name: 'Base64 Encoder/Decoder',
        description: 'Encode and decode Base64 strings',
        category: 'Encoder',
        urlPath: '/tools/base64-encoder-decoder',
        featured: false,
        status: 'PUBLISHED' as const,
        sortOrder: 12,
      },
      {
        slug: 'url-encoder-decoder',
        name: 'URL Encoder/Decoder',
        description: 'Encode and decode URL strings',
        category: 'Encoder',
        urlPath: '/tools/url-encoder-decoder',
        featured: false,
        status: 'PUBLISHED' as const,
        sortOrder: 13,
      },

      // Category: Converter
      {
        slug: 'case-converter',
        name: 'Case Converter',
        description: 'Convert text between camelCase, snake_case, kebab-case, etc.',
        category: 'Converter',
        urlPath: '/tools/case-converter',
        featured: false,
        status: 'PUBLISHED' as const,
        sortOrder: 14,
      },
      {
        slug: 'color-converter',
        name: 'Color Converter',
        description: 'Convert between HEX, RGB, and HSL color formats',
        category: 'Converter',
        urlPath: '/tools/color-converter',
        featured: false,
        status: 'PUBLISHED' as const,
        sortOrder: 15,
      },

      // Category: Text
      {
        slug: 'slug-generator',
        name: 'Slug Generator',
        description: 'Convert text to URL-friendly slugs',
        category: 'Text',
        urlPath: '/tools/slug-generator',
        featured: false,
        status: 'PUBLISHED' as const,
        sortOrder: 16,
      },
      {
        slug: 'lorem-ipsum-generator',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for designs',
        category: 'Text',
        urlPath: '/tools/lorem-ipsum-generator',
        featured: false,
        status: 'PUBLISHED' as const,
        sortOrder: 17,
      },
    ]

    for (const tool of tools) {
      await Tool.updateOrCreate({ slug: tool.slug }, tool)
    }
  }
}
