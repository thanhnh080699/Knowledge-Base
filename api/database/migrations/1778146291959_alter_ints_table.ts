import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_requests'

  async up() {
    this.schema.raw('ALTER TABLE contact_requests DROP PRIMARY KEY, MODIFY id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY')
  }

  async down() {
    this.schema.raw('ALTER TABLE contact_requests DROP PRIMARY KEY, MODIFY id VARCHAR(36) PRIMARY KEY')
  }
}