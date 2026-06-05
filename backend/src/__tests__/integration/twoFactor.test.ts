import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import express from 'express'
import request from 'supertest'

const app = express()
app.use(express.json())

jest.mock('@/config/env', () => ({
  env: {
    PORT: 5000,
    NODE_ENV: 'development',
    JWT_SECRET: 'test_jwt_secret',
    JWT_REFRESH_SECRET: 'test_jwt_refresh_secret',
  },
  isDevelopment: true,
  isProduction: false,
}))

jest.mock('@/middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { _id: req.headers['x-user-id'] || '000000000000000000000001', role: 'user' }
    next()
  },
  authorize: (..._roles: string[]) => (_req: any, _res: any, next: any) => next(),
}))

jest.mock('@/middleware/tenant', () => ({
  resolveTenant: (_req: any, _res: any, next: any) => next(),
}))

jest.mock('@/middleware/audit', () => ({
  auditLog: (_req: any, _res: any, next: any) => next(),
}))

import {
  generateSecret,
  verifyAndEnable,
  disable,
  getStatus,
  generateBackupCodes,
} from '@/controllers/twoFactor.controller'

app.post('/api/v1/auth/2fa/generate', generateSecret)
app.post('/api/v1/auth/2fa/verify', verifyAndEnable)
app.post('/api/v1/auth/2fa/disable', disable)
app.get('/api/v1/auth/2fa/status', getStatus)
app.post('/api/v1/auth/2fa/backup-codes', generateBackupCodes)

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('2FA Controller Integration', () => {
  const userId = new mongoose.Types.ObjectId().toString()

  describe('POST /api/v1/auth/2fa/generate', () => {
    it('should generate 2FA secret', async () => {
      const res = await request(app)
        .post('/api/v1/auth/2fa/generate')
        .set('x-user-id', userId)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.secret).toBeDefined()
      expect(res.body.data.qrCode).toBeDefined()
    })
  })

  describe('GET /api/v1/auth/2fa/status', () => {
    it('should return disabled status initially', async () => {
      const res = await request(app)
        .get('/api/v1/auth/2fa/status')
        .set('x-user-id', userId)

      expect(res.status).toBe(200)
      expect(res.body.data.isEnabled).toBe(false)
    })
  })

  describe('POST /api/v1/auth/2fa/verify', () => {
    it('should reject invalid token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .set('x-user-id', userId)
        .send({ token: '000000' })

      expect(res.status).toBe(400)
    })

    it('should reject without token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .set('x-user-id', userId)
        .send({})

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/v1/auth/2fa/disable', () => {
    it('should reject disable when 2FA not enabled', async () => {
      const res = await request(app)
        .post('/api/v1/auth/2fa/disable')
        .set('x-user-id', userId)
        .send({ token: 'test-token' })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/v1/auth/2fa/backup-codes', () => {
    it('should generate backup codes', async () => {
      const res = await request(app)
        .post('/api/v1/auth/2fa/backup-codes')
        .set('x-user-id', userId)

      expect(res.status).toBe(200)
      expect(res.body.data.codes.length).toBe(10)
    })
  })
})
