import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const MediaController = () => import('#controllers/media_controller')

export default function mediaRoutes() {
  router
    .group(() => {
      router.get('media', [MediaController, 'index']).as('admin.media.index')
      router.get('media/detail', [MediaController, 'show']).as('admin.media.show')
      router.post('media/upload', [MediaController, 'upload']).as('admin.media.upload')
      router.put('media', [MediaController, 'update']).as('admin.media.update')
      router.delete('media', [MediaController, 'destroy']).as('admin.media.destroy')
      router.put('media/move', [MediaController, 'move']).as('admin.media.move')
      router.post('media/folders', [MediaController, 'createFolder']).as('admin.media.folders.create')
      router.put('media/folders', [MediaController, 'renameFolder']).as('admin.media.folders.rename')
      router.delete('media/folders', [MediaController, 'deleteFolder']).as('admin.media.folders.delete')
    })
    .prefix('admin')
    .use(middleware.auth())
}
