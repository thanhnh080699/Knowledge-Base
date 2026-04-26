import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'posts.public.index': { paramsTuple?: []; params?: {} }
    'posts.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.create': { paramsTuple?: []; params?: {} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.public.index': { paramsTuple?: []; params?: {} }
    'categories.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.create': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.public.index': { paramsTuple?: []; params?: {} }
    'tags.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.index': { paramsTuple?: []; params?: {} }
    'tags.create': { paramsTuple?: []; params?: {} }
    'tags.store': { paramsTuple?: []; params?: {} }
    'tags.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.public.index': { paramsTuple?: []; params?: {} }
    'projects.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.public.index': { paramsTuple?: []; params?: {} }
    'services.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.index': { paramsTuple?: []; params?: {} }
    'services.create': { paramsTuple?: []; params?: {} }
    'services.store': { paramsTuple?: []; params?: {} }
    'services.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.store_request': { paramsTuple?: []; params?: {} }
    'contacts.subscribe_newsletter': { paramsTuple?: []; params?: {} }
    'contacts.index_requests': { paramsTuple?: []; params?: {} }
    'contacts.index_newsletters': { paramsTuple?: []; params?: {} }
    'users.force_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.change_password': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.meta': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.meta': { paramsTuple?: []; params?: {} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'roles.create': { paramsTuple?: []; params?: {} }
    'roles.store': { paramsTuple?: []; params?: {} }
    'roles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'permissions.index': { paramsTuple?: []; params?: {} }
    'permissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
    'admin.media.show': { paramsTuple?: []; params?: {} }
    'admin.media.upload': { paramsTuple?: []; params?: {} }
    'admin.media.update': { paramsTuple?: []; params?: {} }
    'admin.media.destroy': { paramsTuple?: []; params?: {} }
    'admin.media.move': { paramsTuple?: []; params?: {} }
    'admin.media.folders.create': { paramsTuple?: []; params?: {} }
    'admin.media.folders.rename': { paramsTuple?: []; params?: {} }
    'admin.media.folders.delete': { paramsTuple?: []; params?: {} }
    'settings.show_group': { paramsTuple: [ParamValue]; params: {'group': ParamValue} }
    'settings.update_group': { paramsTuple: [ParamValue]; params: {'group': ParamValue} }
    'settings.send_test_email': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'posts.public.index': { paramsTuple?: []; params?: {} }
    'posts.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.create': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.public.index': { paramsTuple?: []; params?: {} }
    'categories.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.create': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.public.index': { paramsTuple?: []; params?: {} }
    'tags.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.index': { paramsTuple?: []; params?: {} }
    'tags.create': { paramsTuple?: []; params?: {} }
    'tags.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.public.index': { paramsTuple?: []; params?: {} }
    'projects.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.public.index': { paramsTuple?: []; params?: {} }
    'services.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.index': { paramsTuple?: []; params?: {} }
    'services.create': { paramsTuple?: []; params?: {} }
    'services.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.index_requests': { paramsTuple?: []; params?: {} }
    'contacts.index_newsletters': { paramsTuple?: []; params?: {} }
    'users.meta': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.meta': { paramsTuple?: []; params?: {} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'roles.create': { paramsTuple?: []; params?: {} }
    'roles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'permissions.index': { paramsTuple?: []; params?: {} }
    'permissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
    'admin.media.show': { paramsTuple?: []; params?: {} }
    'settings.show_group': { paramsTuple: [ParamValue]; params: {'group': ParamValue} }
  }
  HEAD: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'posts.public.index': { paramsTuple?: []; params?: {} }
    'posts.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.create': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.public.index': { paramsTuple?: []; params?: {} }
    'categories.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.create': { paramsTuple?: []; params?: {} }
    'categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.public.index': { paramsTuple?: []; params?: {} }
    'tags.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.index': { paramsTuple?: []; params?: {} }
    'tags.create': { paramsTuple?: []; params?: {} }
    'tags.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.public.index': { paramsTuple?: []; params?: {} }
    'projects.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.create': { paramsTuple?: []; params?: {} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.public.index': { paramsTuple?: []; params?: {} }
    'services.public.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.index': { paramsTuple?: []; params?: {} }
    'services.create': { paramsTuple?: []; params?: {} }
    'services.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.index_requests': { paramsTuple?: []; params?: {} }
    'contacts.index_newsletters': { paramsTuple?: []; params?: {} }
    'users.meta': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.meta': { paramsTuple?: []; params?: {} }
    'roles.index': { paramsTuple?: []; params?: {} }
    'roles.create': { paramsTuple?: []; params?: {} }
    'roles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'permissions.index': { paramsTuple?: []; params?: {} }
    'permissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.media.index': { paramsTuple?: []; params?: {} }
    'admin.media.show': { paramsTuple?: []; params?: {} }
    'settings.show_group': { paramsTuple: [ParamValue]; params: {'group': ParamValue} }
  }
  POST: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'tags.store': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'services.store': { paramsTuple?: []; params?: {} }
    'contacts.store_request': { paramsTuple?: []; params?: {} }
    'contacts.subscribe_newsletter': { paramsTuple?: []; params?: {} }
    'users.change_password': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.store': { paramsTuple?: []; params?: {} }
    'roles.store': { paramsTuple?: []; params?: {} }
    'admin.media.upload': { paramsTuple?: []; params?: {} }
    'admin.media.folders.create': { paramsTuple?: []; params?: {} }
    'settings.send_test_email': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.media.update': { paramsTuple?: []; params?: {} }
    'admin.media.move': { paramsTuple?: []; params?: {} }
    'admin.media.folders.rename': { paramsTuple?: []; params?: {} }
    'settings.update_group': { paramsTuple: [ParamValue]; params: {'group': ParamValue} }
  }
  PATCH: {
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tags.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'services.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.force_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'roles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.media.destroy': { paramsTuple?: []; params?: {} }
    'admin.media.folders.delete': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}