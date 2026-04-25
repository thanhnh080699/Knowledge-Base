import { fileURLToPath } from 'node:url'

export default {
  path: fileURLToPath(new URL('../', import.meta.url)),
  title: 'thanhnh.id.vn API',
  version: '1.0.0',
  tagIndex: 2,
  info: {
    title: 'thanhnh.id.vn API',
    version: '1.0.0',
    description: 'Hệ thống API phục vụ website cá nhân thanhnh.id.vn',
  },
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  authMiddlewares: ['auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showSummary: true,
  productionEnv: 'production',
}
