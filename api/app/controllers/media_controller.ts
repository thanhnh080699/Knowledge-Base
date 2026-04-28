import type { HttpContext } from '@adonisjs/core/http'
import CdnMediaService from '#services/cdn_media_service'
import {
  createFolderValidator,
  deleteFolderValidator,
  moveMediaValidator,
  renameFolderValidator,
  updateMediaValidator,
} from '#validators/media'

export default class MediaController {
  private cdn = new CdnMediaService()

  /**
   * @index
   * @tag MEDIA
   * @description List CDN folders and media files
   */
  async index({ request, response }: HttpContext) {
    const data = await this.cdn.get('/api/media', {
      folder: request.input('folder', ''),
      sort: request.input('sort', 'updated_at'),
      direction: request.input('direction', 'desc'),
      limit: request.input('limit'),
      offset: request.input('offset'),
    })
    return response.ok(data)
  }

  /**
   * @show
   * @tag MEDIA
   * @description Show media detail by path
   */
  async show({ request, response }: HttpContext) {
    const data = await this.cdn.get('/api/media/detail', {
      path: request.input('path'),
    })
    return response.ok(data)
  }

  /**
   * @upload
   * @tag MEDIA
   * @description Upload media to CDN through API gateway
   */
  async upload({ request, response }: HttpContext) {
    const file = request.file('file')
    if (!file || !file.tmpPath) {
      return response.badRequest({ error: 'file is required' })
    }

    const data = await this.cdn.upload({
      tmpPath: file.tmpPath,
      clientName: file.clientName,
      type: file.type,
      folder: request.input('folder', ''),
      width: request.input('width'),
      height: request.input('height'),
    })

    return response.created(data)
  }

  /**
   * @update
   * @tag MEDIA
   * @description Update media metadata
   */
  async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateMediaValidator)
    const data = await this.cdn.put('/api/media', {
      path: payload.path,
      alt: payload.alt || '',
      align: payload.align || 'none',
      display_width: payload.displayWidth || 0,
      display_height: payload.displayHeight || 0,
      format: payload.format || 'webp',
    })
    return response.ok(data)
  }

  /**
   * @destroy
   * @tag MEDIA
   * @description Delete media file
   */
  async destroy({ request, response }: HttpContext) {
    const path = request.input('path')
    const data = await this.cdn.delete('/api/file', undefined, { path })
    return response.ok(data)
  }

  /**
   * @move
   * @tag MEDIA
   * @description Move media file to another folder
   */
  async move({ request, response }: HttpContext) {
    const payload = await request.validateUsing(moveMediaValidator)
    const data = await this.cdn.put('/api/media/move', {
      path: payload.path,
      folder: payload.folder || '',
    })
    return response.ok(data)
  }

  async createFolder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createFolderValidator)
    const data = await this.cdn.post('/api/folder', { path: payload.path })
    return response.created(data)
  }

  async renameFolder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(renameFolderValidator)
    const data = await this.cdn.put('/api/folder', {
      old_path: payload.oldPath,
      new_path: payload.newPath,
    })
    return response.ok(data)
  }

  async deleteFolder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(deleteFolderValidator)
    const data = await this.cdn.delete('/api/folder', { path: payload.path })
    return response.ok(data)
  }
}
