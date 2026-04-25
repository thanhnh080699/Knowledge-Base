import { BaseModel, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'

export const withUuid = <T extends NormalizeConstructor<typeof BaseModel>>(base: T) => {
  class ModelWithUuid extends base {
    declare id: string

    @beforeCreate()
    static async generateUuid(model: ModelWithUuid) {
      if (!model.id) {
        model.id = randomUUID()
      }
    }
  }
  return ModelWithUuid
}
