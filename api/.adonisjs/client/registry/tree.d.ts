/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
    me: typeof routes['auth.me']
  }
  posts: {
    public: {
      index: typeof routes['posts.public.index']
      show: typeof routes['posts.public.show']
    }
    index: typeof routes['posts.index']
    create: typeof routes['posts.create']
    store: typeof routes['posts.store']
    show: typeof routes['posts.show']
    edit: typeof routes['posts.edit']
    update: typeof routes['posts.update']
    destroy: typeof routes['posts.destroy']
  }
  categories: {
    public: {
      index: typeof routes['categories.public.index']
      show: typeof routes['categories.public.show']
    }
    index: typeof routes['categories.index']
    create: typeof routes['categories.create']
    store: typeof routes['categories.store']
    show: typeof routes['categories.show']
    edit: typeof routes['categories.edit']
    update: typeof routes['categories.update']
    destroy: typeof routes['categories.destroy']
  }
  tags: {
    public: {
      index: typeof routes['tags.public.index']
      show: typeof routes['tags.public.show']
    }
    index: typeof routes['tags.index']
    create: typeof routes['tags.create']
    store: typeof routes['tags.store']
    show: typeof routes['tags.show']
    edit: typeof routes['tags.edit']
    update: typeof routes['tags.update']
    destroy: typeof routes['tags.destroy']
  }
  projects: {
    public: {
      index: typeof routes['projects.public.index']
      show: typeof routes['projects.public.show']
    }
    index: typeof routes['projects.index']
    create: typeof routes['projects.create']
    store: typeof routes['projects.store']
    show: typeof routes['projects.show']
    edit: typeof routes['projects.edit']
    update: typeof routes['projects.update']
    destroy: typeof routes['projects.destroy']
  }
  services: {
    public: {
      index: typeof routes['services.public.index']
      show: typeof routes['services.public.show']
    }
    index: typeof routes['services.index']
    create: typeof routes['services.create']
    store: typeof routes['services.store']
    show: typeof routes['services.show']
    edit: typeof routes['services.edit']
    update: typeof routes['services.update']
    destroy: typeof routes['services.destroy']
  }
  contacts: {
    storeRequest: typeof routes['contacts.store_request']
    subscribeNewsletter: typeof routes['contacts.subscribe_newsletter']
    indexRequests: typeof routes['contacts.index_requests']
    indexNewsletters: typeof routes['contacts.index_newsletters']
  }
  users: {
    forceDestroy: typeof routes['users.force_destroy']
    meta: typeof routes['users.meta']
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    edit: typeof routes['users.edit']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  roles: {
    meta: typeof routes['roles.meta']
    index: typeof routes['roles.index']
    create: typeof routes['roles.create']
    store: typeof routes['roles.store']
    show: typeof routes['roles.show']
    edit: typeof routes['roles.edit']
    update: typeof routes['roles.update']
    destroy: typeof routes['roles.destroy']
  }
  permissions: {
    index: typeof routes['permissions.index']
    show: typeof routes['permissions.show']
  }
  admin: {
    media: {
      index: typeof routes['admin.media.index']
      show: typeof routes['admin.media.show']
      upload: typeof routes['admin.media.upload']
      update: typeof routes['admin.media.update']
      destroy: typeof routes['admin.media.destroy']
      move: typeof routes['admin.media.move']
      folders: {
        create: typeof routes['admin.media.folders.create']
        rename: typeof routes['admin.media.folders.rename']
        delete: typeof routes['admin.media.folders.delete']
      }
    }
  }
}
