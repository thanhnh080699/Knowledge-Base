/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/auth/login',
    tokens: [{"old":"/api/auth/login","type":0,"val":"api","end":""},{"old":"/api/auth/login","type":0,"val":"auth","end":""},{"old":"/api/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/me',
    tokens: [{"old":"/api/auth/me","type":0,"val":"api","end":""},{"old":"/api/auth/me","type":0,"val":"auth","end":""},{"old":"/api/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
  },
  'auth.update_profile': {
    methods: ["PUT"],
    pattern: '/api/auth/profile',
    tokens: [{"old":"/api/auth/profile","type":0,"val":"api","end":""},{"old":"/api/auth/profile","type":0,"val":"auth","end":""},{"old":"/api/auth/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['auth.update_profile']['types'],
  },
  'auth.change_password': {
    methods: ["PUT"],
    pattern: '/api/auth/change-password',
    tokens: [{"old":"/api/auth/change-password","type":0,"val":"api","end":""},{"old":"/api/auth/change-password","type":0,"val":"auth","end":""},{"old":"/api/auth/change-password","type":0,"val":"change-password","end":""}],
    types: placeholder as Registry['auth.change_password']['types'],
  },
  'posts.public.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/posts',
    tokens: [{"old":"/api/posts","type":0,"val":"api","end":""},{"old":"/api/posts","type":0,"val":"posts","end":""}],
    types: placeholder as Registry['posts.public.index']['types'],
  },
  'posts.public.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/posts/:id',
    tokens: [{"old":"/api/posts/:id","type":0,"val":"api","end":""},{"old":"/api/posts/:id","type":0,"val":"posts","end":""},{"old":"/api/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['posts.public.show']['types'],
  },
  'posts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/posts',
    tokens: [{"old":"/api/admin/posts","type":0,"val":"api","end":""},{"old":"/api/admin/posts","type":0,"val":"admin","end":""},{"old":"/api/admin/posts","type":0,"val":"posts","end":""}],
    types: placeholder as Registry['posts.index']['types'],
  },
  'posts.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/posts/create',
    tokens: [{"old":"/api/admin/posts/create","type":0,"val":"api","end":""},{"old":"/api/admin/posts/create","type":0,"val":"admin","end":""},{"old":"/api/admin/posts/create","type":0,"val":"posts","end":""},{"old":"/api/admin/posts/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['posts.create']['types'],
  },
  'posts.store': {
    methods: ["POST"],
    pattern: '/api/admin/posts',
    tokens: [{"old":"/api/admin/posts","type":0,"val":"api","end":""},{"old":"/api/admin/posts","type":0,"val":"admin","end":""},{"old":"/api/admin/posts","type":0,"val":"posts","end":""}],
    types: placeholder as Registry['posts.store']['types'],
  },
  'posts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/posts/:id',
    tokens: [{"old":"/api/admin/posts/:id","type":0,"val":"api","end":""},{"old":"/api/admin/posts/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/posts/:id","type":0,"val":"posts","end":""},{"old":"/api/admin/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['posts.show']['types'],
  },
  'posts.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/posts/:id/edit',
    tokens: [{"old":"/api/admin/posts/:id/edit","type":0,"val":"api","end":""},{"old":"/api/admin/posts/:id/edit","type":0,"val":"admin","end":""},{"old":"/api/admin/posts/:id/edit","type":0,"val":"posts","end":""},{"old":"/api/admin/posts/:id/edit","type":1,"val":"id","end":""},{"old":"/api/admin/posts/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['posts.edit']['types'],
  },
  'posts.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/admin/posts/:id',
    tokens: [{"old":"/api/admin/posts/:id","type":0,"val":"api","end":""},{"old":"/api/admin/posts/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/posts/:id","type":0,"val":"posts","end":""},{"old":"/api/admin/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['posts.update']['types'],
  },
  'posts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/posts/:id',
    tokens: [{"old":"/api/admin/posts/:id","type":0,"val":"api","end":""},{"old":"/api/admin/posts/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/posts/:id","type":0,"val":"posts","end":""},{"old":"/api/admin/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['posts.destroy']['types'],
  },
  'categories.public.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/categories',
    tokens: [{"old":"/api/categories","type":0,"val":"api","end":""},{"old":"/api/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.public.index']['types'],
  },
  'categories.public.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/categories/:id',
    tokens: [{"old":"/api/categories/:id","type":0,"val":"api","end":""},{"old":"/api/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.public.show']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/categories',
    tokens: [{"old":"/api/admin/categories","type":0,"val":"api","end":""},{"old":"/api/admin/categories","type":0,"val":"admin","end":""},{"old":"/api/admin/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/categories/create',
    tokens: [{"old":"/api/admin/categories/create","type":0,"val":"api","end":""},{"old":"/api/admin/categories/create","type":0,"val":"admin","end":""},{"old":"/api/admin/categories/create","type":0,"val":"categories","end":""},{"old":"/api/admin/categories/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['categories.create']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/api/admin/categories',
    tokens: [{"old":"/api/admin/categories","type":0,"val":"api","end":""},{"old":"/api/admin/categories","type":0,"val":"admin","end":""},{"old":"/api/admin/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/categories/:id',
    tokens: [{"old":"/api/admin/categories/:id","type":0,"val":"api","end":""},{"old":"/api/admin/categories/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/admin/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.show']['types'],
  },
  'categories.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/categories/:id/edit',
    tokens: [{"old":"/api/admin/categories/:id/edit","type":0,"val":"api","end":""},{"old":"/api/admin/categories/:id/edit","type":0,"val":"admin","end":""},{"old":"/api/admin/categories/:id/edit","type":0,"val":"categories","end":""},{"old":"/api/admin/categories/:id/edit","type":1,"val":"id","end":""},{"old":"/api/admin/categories/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['categories.edit']['types'],
  },
  'categories.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/admin/categories/:id',
    tokens: [{"old":"/api/admin/categories/:id","type":0,"val":"api","end":""},{"old":"/api/admin/categories/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/admin/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.update']['types'],
  },
  'categories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/categories/:id',
    tokens: [{"old":"/api/admin/categories/:id","type":0,"val":"api","end":""},{"old":"/api/admin/categories/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/admin/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.destroy']['types'],
  },
  'tags.public.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/tags',
    tokens: [{"old":"/api/tags","type":0,"val":"api","end":""},{"old":"/api/tags","type":0,"val":"tags","end":""}],
    types: placeholder as Registry['tags.public.index']['types'],
  },
  'tags.public.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/tags/:id',
    tokens: [{"old":"/api/tags/:id","type":0,"val":"api","end":""},{"old":"/api/tags/:id","type":0,"val":"tags","end":""},{"old":"/api/tags/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tags.public.show']['types'],
  },
  'tags.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/tags',
    tokens: [{"old":"/api/admin/tags","type":0,"val":"api","end":""},{"old":"/api/admin/tags","type":0,"val":"admin","end":""},{"old":"/api/admin/tags","type":0,"val":"tags","end":""}],
    types: placeholder as Registry['tags.index']['types'],
  },
  'tags.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/tags/create',
    tokens: [{"old":"/api/admin/tags/create","type":0,"val":"api","end":""},{"old":"/api/admin/tags/create","type":0,"val":"admin","end":""},{"old":"/api/admin/tags/create","type":0,"val":"tags","end":""},{"old":"/api/admin/tags/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['tags.create']['types'],
  },
  'tags.store': {
    methods: ["POST"],
    pattern: '/api/admin/tags',
    tokens: [{"old":"/api/admin/tags","type":0,"val":"api","end":""},{"old":"/api/admin/tags","type":0,"val":"admin","end":""},{"old":"/api/admin/tags","type":0,"val":"tags","end":""}],
    types: placeholder as Registry['tags.store']['types'],
  },
  'tags.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/tags/:id',
    tokens: [{"old":"/api/admin/tags/:id","type":0,"val":"api","end":""},{"old":"/api/admin/tags/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/tags/:id","type":0,"val":"tags","end":""},{"old":"/api/admin/tags/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tags.show']['types'],
  },
  'tags.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/tags/:id/edit',
    tokens: [{"old":"/api/admin/tags/:id/edit","type":0,"val":"api","end":""},{"old":"/api/admin/tags/:id/edit","type":0,"val":"admin","end":""},{"old":"/api/admin/tags/:id/edit","type":0,"val":"tags","end":""},{"old":"/api/admin/tags/:id/edit","type":1,"val":"id","end":""},{"old":"/api/admin/tags/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['tags.edit']['types'],
  },
  'tags.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/admin/tags/:id',
    tokens: [{"old":"/api/admin/tags/:id","type":0,"val":"api","end":""},{"old":"/api/admin/tags/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/tags/:id","type":0,"val":"tags","end":""},{"old":"/api/admin/tags/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tags.update']['types'],
  },
  'tags.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/tags/:id',
    tokens: [{"old":"/api/admin/tags/:id","type":0,"val":"api","end":""},{"old":"/api/admin/tags/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/tags/:id","type":0,"val":"tags","end":""},{"old":"/api/admin/tags/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tags.destroy']['types'],
  },
  'projects.public.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/projects',
    tokens: [{"old":"/api/projects","type":0,"val":"api","end":""},{"old":"/api/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.public.index']['types'],
  },
  'projects.public.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/projects/:id',
    tokens: [{"old":"/api/projects/:id","type":0,"val":"api","end":""},{"old":"/api/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.public.show']['types'],
  },
  'projects.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/projects',
    tokens: [{"old":"/api/admin/projects","type":0,"val":"api","end":""},{"old":"/api/admin/projects","type":0,"val":"admin","end":""},{"old":"/api/admin/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.index']['types'],
  },
  'projects.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/projects/create',
    tokens: [{"old":"/api/admin/projects/create","type":0,"val":"api","end":""},{"old":"/api/admin/projects/create","type":0,"val":"admin","end":""},{"old":"/api/admin/projects/create","type":0,"val":"projects","end":""},{"old":"/api/admin/projects/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['projects.create']['types'],
  },
  'projects.store': {
    methods: ["POST"],
    pattern: '/api/admin/projects',
    tokens: [{"old":"/api/admin/projects","type":0,"val":"api","end":""},{"old":"/api/admin/projects","type":0,"val":"admin","end":""},{"old":"/api/admin/projects","type":0,"val":"projects","end":""}],
    types: placeholder as Registry['projects.store']['types'],
  },
  'projects.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/projects/:id',
    tokens: [{"old":"/api/admin/projects/:id","type":0,"val":"api","end":""},{"old":"/api/admin/projects/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/admin/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.show']['types'],
  },
  'projects.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/projects/:id/edit',
    tokens: [{"old":"/api/admin/projects/:id/edit","type":0,"val":"api","end":""},{"old":"/api/admin/projects/:id/edit","type":0,"val":"admin","end":""},{"old":"/api/admin/projects/:id/edit","type":0,"val":"projects","end":""},{"old":"/api/admin/projects/:id/edit","type":1,"val":"id","end":""},{"old":"/api/admin/projects/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['projects.edit']['types'],
  },
  'projects.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/admin/projects/:id',
    tokens: [{"old":"/api/admin/projects/:id","type":0,"val":"api","end":""},{"old":"/api/admin/projects/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/admin/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.update']['types'],
  },
  'projects.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/projects/:id',
    tokens: [{"old":"/api/admin/projects/:id","type":0,"val":"api","end":""},{"old":"/api/admin/projects/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/projects/:id","type":0,"val":"projects","end":""},{"old":"/api/admin/projects/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['projects.destroy']['types'],
  },
  'services.public.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/services',
    tokens: [{"old":"/api/services","type":0,"val":"api","end":""},{"old":"/api/services","type":0,"val":"services","end":""}],
    types: placeholder as Registry['services.public.index']['types'],
  },
  'services.public.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/services/:id',
    tokens: [{"old":"/api/services/:id","type":0,"val":"api","end":""},{"old":"/api/services/:id","type":0,"val":"services","end":""},{"old":"/api/services/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['services.public.show']['types'],
  },
  'services.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/services',
    tokens: [{"old":"/api/admin/services","type":0,"val":"api","end":""},{"old":"/api/admin/services","type":0,"val":"admin","end":""},{"old":"/api/admin/services","type":0,"val":"services","end":""}],
    types: placeholder as Registry['services.index']['types'],
  },
  'services.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/services/create',
    tokens: [{"old":"/api/admin/services/create","type":0,"val":"api","end":""},{"old":"/api/admin/services/create","type":0,"val":"admin","end":""},{"old":"/api/admin/services/create","type":0,"val":"services","end":""},{"old":"/api/admin/services/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['services.create']['types'],
  },
  'services.store': {
    methods: ["POST"],
    pattern: '/api/admin/services',
    tokens: [{"old":"/api/admin/services","type":0,"val":"api","end":""},{"old":"/api/admin/services","type":0,"val":"admin","end":""},{"old":"/api/admin/services","type":0,"val":"services","end":""}],
    types: placeholder as Registry['services.store']['types'],
  },
  'services.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/services/:id',
    tokens: [{"old":"/api/admin/services/:id","type":0,"val":"api","end":""},{"old":"/api/admin/services/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/services/:id","type":0,"val":"services","end":""},{"old":"/api/admin/services/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['services.show']['types'],
  },
  'services.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/services/:id/edit',
    tokens: [{"old":"/api/admin/services/:id/edit","type":0,"val":"api","end":""},{"old":"/api/admin/services/:id/edit","type":0,"val":"admin","end":""},{"old":"/api/admin/services/:id/edit","type":0,"val":"services","end":""},{"old":"/api/admin/services/:id/edit","type":1,"val":"id","end":""},{"old":"/api/admin/services/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['services.edit']['types'],
  },
  'services.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/admin/services/:id',
    tokens: [{"old":"/api/admin/services/:id","type":0,"val":"api","end":""},{"old":"/api/admin/services/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/services/:id","type":0,"val":"services","end":""},{"old":"/api/admin/services/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['services.update']['types'],
  },
  'services.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/services/:id',
    tokens: [{"old":"/api/admin/services/:id","type":0,"val":"api","end":""},{"old":"/api/admin/services/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/services/:id","type":0,"val":"services","end":""},{"old":"/api/admin/services/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['services.destroy']['types'],
  },
  'contacts.store_request': {
    methods: ["POST"],
    pattern: '/api/contact',
    tokens: [{"old":"/api/contact","type":0,"val":"api","end":""},{"old":"/api/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['contacts.store_request']['types'],
  },
  'contacts.subscribe_newsletter': {
    methods: ["POST"],
    pattern: '/api/newsletter',
    tokens: [{"old":"/api/newsletter","type":0,"val":"api","end":""},{"old":"/api/newsletter","type":0,"val":"newsletter","end":""}],
    types: placeholder as Registry['contacts.subscribe_newsletter']['types'],
  },
  'contacts.index_requests': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/contact-requests',
    tokens: [{"old":"/api/admin/contact-requests","type":0,"val":"api","end":""},{"old":"/api/admin/contact-requests","type":0,"val":"admin","end":""},{"old":"/api/admin/contact-requests","type":0,"val":"contact-requests","end":""}],
    types: placeholder as Registry['contacts.index_requests']['types'],
  },
  'contacts.index_newsletters': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/newsletters',
    tokens: [{"old":"/api/admin/newsletters","type":0,"val":"api","end":""},{"old":"/api/admin/newsletters","type":0,"val":"admin","end":""},{"old":"/api/admin/newsletters","type":0,"val":"newsletters","end":""}],
    types: placeholder as Registry['contacts.index_newsletters']['types'],
  },
  'users.force_destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/users/:id/force',
    tokens: [{"old":"/api/admin/users/:id/force","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id/force","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id/force","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id/force","type":1,"val":"id","end":""},{"old":"/api/admin/users/:id/force","type":0,"val":"force","end":""}],
    types: placeholder as Registry['users.force_destroy']['types'],
  },
  'users.change_password': {
    methods: ["POST"],
    pattern: '/api/admin/users/:id/change-password',
    tokens: [{"old":"/api/admin/users/:id/change-password","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id/change-password","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id/change-password","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id/change-password","type":1,"val":"id","end":""},{"old":"/api/admin/users/:id/change-password","type":0,"val":"change-password","end":""}],
    types: placeholder as Registry['users.change_password']['types'],
  },
  'users.meta': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/users/meta',
    tokens: [{"old":"/api/admin/users/meta","type":0,"val":"api","end":""},{"old":"/api/admin/users/meta","type":0,"val":"admin","end":""},{"old":"/api/admin/users/meta","type":0,"val":"users","end":""},{"old":"/api/admin/users/meta","type":0,"val":"meta","end":""}],
    types: placeholder as Registry['users.meta']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/users',
    tokens: [{"old":"/api/admin/users","type":0,"val":"api","end":""},{"old":"/api/admin/users","type":0,"val":"admin","end":""},{"old":"/api/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/users/create',
    tokens: [{"old":"/api/admin/users/create","type":0,"val":"api","end":""},{"old":"/api/admin/users/create","type":0,"val":"admin","end":""},{"old":"/api/admin/users/create","type":0,"val":"users","end":""},{"old":"/api/admin/users/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['users.create']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/api/admin/users',
    tokens: [{"old":"/api/admin/users","type":0,"val":"api","end":""},{"old":"/api/admin/users","type":0,"val":"admin","end":""},{"old":"/api/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/users/:id',
    tokens: [{"old":"/api/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.show']['types'],
  },
  'users.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/users/:id/edit',
    tokens: [{"old":"/api/admin/users/:id/edit","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id/edit","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id/edit","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id/edit","type":1,"val":"id","end":""},{"old":"/api/admin/users/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['users.edit']['types'],
  },
  'users.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/admin/users/:id',
    tokens: [{"old":"/api/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/users/:id',
    tokens: [{"old":"/api/admin/users/:id","type":0,"val":"api","end":""},{"old":"/api/admin/users/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/users/:id","type":0,"val":"users","end":""},{"old":"/api/admin/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'roles.meta': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/roles/meta',
    tokens: [{"old":"/api/admin/roles/meta","type":0,"val":"api","end":""},{"old":"/api/admin/roles/meta","type":0,"val":"admin","end":""},{"old":"/api/admin/roles/meta","type":0,"val":"roles","end":""},{"old":"/api/admin/roles/meta","type":0,"val":"meta","end":""}],
    types: placeholder as Registry['roles.meta']['types'],
  },
  'roles.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/roles',
    tokens: [{"old":"/api/admin/roles","type":0,"val":"api","end":""},{"old":"/api/admin/roles","type":0,"val":"admin","end":""},{"old":"/api/admin/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles.index']['types'],
  },
  'roles.create': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/roles/create',
    tokens: [{"old":"/api/admin/roles/create","type":0,"val":"api","end":""},{"old":"/api/admin/roles/create","type":0,"val":"admin","end":""},{"old":"/api/admin/roles/create","type":0,"val":"roles","end":""},{"old":"/api/admin/roles/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['roles.create']['types'],
  },
  'roles.store': {
    methods: ["POST"],
    pattern: '/api/admin/roles',
    tokens: [{"old":"/api/admin/roles","type":0,"val":"api","end":""},{"old":"/api/admin/roles","type":0,"val":"admin","end":""},{"old":"/api/admin/roles","type":0,"val":"roles","end":""}],
    types: placeholder as Registry['roles.store']['types'],
  },
  'roles.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/roles/:id',
    tokens: [{"old":"/api/admin/roles/:id","type":0,"val":"api","end":""},{"old":"/api/admin/roles/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/roles/:id","type":0,"val":"roles","end":""},{"old":"/api/admin/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.show']['types'],
  },
  'roles.edit': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/roles/:id/edit',
    tokens: [{"old":"/api/admin/roles/:id/edit","type":0,"val":"api","end":""},{"old":"/api/admin/roles/:id/edit","type":0,"val":"admin","end":""},{"old":"/api/admin/roles/:id/edit","type":0,"val":"roles","end":""},{"old":"/api/admin/roles/:id/edit","type":1,"val":"id","end":""},{"old":"/api/admin/roles/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['roles.edit']['types'],
  },
  'roles.update': {
    methods: ["PUT","PATCH"],
    pattern: '/api/admin/roles/:id',
    tokens: [{"old":"/api/admin/roles/:id","type":0,"val":"api","end":""},{"old":"/api/admin/roles/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/roles/:id","type":0,"val":"roles","end":""},{"old":"/api/admin/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.update']['types'],
  },
  'roles.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/roles/:id',
    tokens: [{"old":"/api/admin/roles/:id","type":0,"val":"api","end":""},{"old":"/api/admin/roles/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/roles/:id","type":0,"val":"roles","end":""},{"old":"/api/admin/roles/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['roles.destroy']['types'],
  },
  'permissions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/permissions',
    tokens: [{"old":"/api/admin/permissions","type":0,"val":"api","end":""},{"old":"/api/admin/permissions","type":0,"val":"admin","end":""},{"old":"/api/admin/permissions","type":0,"val":"permissions","end":""}],
    types: placeholder as Registry['permissions.index']['types'],
  },
  'permissions.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/permissions/:id',
    tokens: [{"old":"/api/admin/permissions/:id","type":0,"val":"api","end":""},{"old":"/api/admin/permissions/:id","type":0,"val":"admin","end":""},{"old":"/api/admin/permissions/:id","type":0,"val":"permissions","end":""},{"old":"/api/admin/permissions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['permissions.show']['types'],
  },
  'admin.media.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/media',
    tokens: [{"old":"/api/admin/media","type":0,"val":"api","end":""},{"old":"/api/admin/media","type":0,"val":"admin","end":""},{"old":"/api/admin/media","type":0,"val":"media","end":""}],
    types: placeholder as Registry['admin.media.index']['types'],
  },
  'admin.media.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/media/detail',
    tokens: [{"old":"/api/admin/media/detail","type":0,"val":"api","end":""},{"old":"/api/admin/media/detail","type":0,"val":"admin","end":""},{"old":"/api/admin/media/detail","type":0,"val":"media","end":""},{"old":"/api/admin/media/detail","type":0,"val":"detail","end":""}],
    types: placeholder as Registry['admin.media.show']['types'],
  },
  'admin.media.upload': {
    methods: ["POST"],
    pattern: '/api/admin/media/upload',
    tokens: [{"old":"/api/admin/media/upload","type":0,"val":"api","end":""},{"old":"/api/admin/media/upload","type":0,"val":"admin","end":""},{"old":"/api/admin/media/upload","type":0,"val":"media","end":""},{"old":"/api/admin/media/upload","type":0,"val":"upload","end":""}],
    types: placeholder as Registry['admin.media.upload']['types'],
  },
  'admin.media.update': {
    methods: ["PUT"],
    pattern: '/api/admin/media',
    tokens: [{"old":"/api/admin/media","type":0,"val":"api","end":""},{"old":"/api/admin/media","type":0,"val":"admin","end":""},{"old":"/api/admin/media","type":0,"val":"media","end":""}],
    types: placeholder as Registry['admin.media.update']['types'],
  },
  'admin.media.destroy': {
    methods: ["DELETE"],
    pattern: '/api/admin/media',
    tokens: [{"old":"/api/admin/media","type":0,"val":"api","end":""},{"old":"/api/admin/media","type":0,"val":"admin","end":""},{"old":"/api/admin/media","type":0,"val":"media","end":""}],
    types: placeholder as Registry['admin.media.destroy']['types'],
  },
  'admin.media.move': {
    methods: ["PUT"],
    pattern: '/api/admin/media/move',
    tokens: [{"old":"/api/admin/media/move","type":0,"val":"api","end":""},{"old":"/api/admin/media/move","type":0,"val":"admin","end":""},{"old":"/api/admin/media/move","type":0,"val":"media","end":""},{"old":"/api/admin/media/move","type":0,"val":"move","end":""}],
    types: placeholder as Registry['admin.media.move']['types'],
  },
  'admin.media.folders.create': {
    methods: ["POST"],
    pattern: '/api/admin/media/folders',
    tokens: [{"old":"/api/admin/media/folders","type":0,"val":"api","end":""},{"old":"/api/admin/media/folders","type":0,"val":"admin","end":""},{"old":"/api/admin/media/folders","type":0,"val":"media","end":""},{"old":"/api/admin/media/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['admin.media.folders.create']['types'],
  },
  'admin.media.folders.rename': {
    methods: ["PUT"],
    pattern: '/api/admin/media/folders',
    tokens: [{"old":"/api/admin/media/folders","type":0,"val":"api","end":""},{"old":"/api/admin/media/folders","type":0,"val":"admin","end":""},{"old":"/api/admin/media/folders","type":0,"val":"media","end":""},{"old":"/api/admin/media/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['admin.media.folders.rename']['types'],
  },
  'admin.media.folders.delete': {
    methods: ["DELETE"],
    pattern: '/api/admin/media/folders',
    tokens: [{"old":"/api/admin/media/folders","type":0,"val":"api","end":""},{"old":"/api/admin/media/folders","type":0,"val":"admin","end":""},{"old":"/api/admin/media/folders","type":0,"val":"media","end":""},{"old":"/api/admin/media/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['admin.media.folders.delete']['types'],
  },
  'settings.show_group': {
    methods: ["GET","HEAD"],
    pattern: '/api/admin/settings/:group',
    tokens: [{"old":"/api/admin/settings/:group","type":0,"val":"api","end":""},{"old":"/api/admin/settings/:group","type":0,"val":"admin","end":""},{"old":"/api/admin/settings/:group","type":0,"val":"settings","end":""},{"old":"/api/admin/settings/:group","type":1,"val":"group","end":""}],
    types: placeholder as Registry['settings.show_group']['types'],
  },
  'settings.update_group': {
    methods: ["PUT"],
    pattern: '/api/admin/settings/:group',
    tokens: [{"old":"/api/admin/settings/:group","type":0,"val":"api","end":""},{"old":"/api/admin/settings/:group","type":0,"val":"admin","end":""},{"old":"/api/admin/settings/:group","type":0,"val":"settings","end":""},{"old":"/api/admin/settings/:group","type":1,"val":"group","end":""}],
    types: placeholder as Registry['settings.update_group']['types'],
  },
  'settings.send_test_email': {
    methods: ["POST"],
    pattern: '/api/admin/settings/email/test',
    tokens: [{"old":"/api/admin/settings/email/test","type":0,"val":"api","end":""},{"old":"/api/admin/settings/email/test","type":0,"val":"admin","end":""},{"old":"/api/admin/settings/email/test","type":0,"val":"settings","end":""},{"old":"/api/admin/settings/email/test","type":0,"val":"email","end":""},{"old":"/api/admin/settings/email/test","type":0,"val":"test","end":""}],
    types: placeholder as Registry['settings.send_test_email']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
