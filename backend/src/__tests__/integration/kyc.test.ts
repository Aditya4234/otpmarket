import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import express from 'express'
import request from 'supertest'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    req.user = { _id: req.headers['x-user-id'] || '000000000000000000000001', role: req.headers['x-user-role'] || 'user' }
    next()
  },
  authorize: (...roles: string[]) => (req: any, _res: any, next: any) => {
    if (roles.length && !roles.includes(req.headers['x-user-role'] || 'user')) {
      return _res.status(403).json({ success: false, message: 'Forbidden' })
    }
    next()
  },
}))

jest.mock('@/middleware/tenant', () => ({
  resolveTenant: (_req: any, _res: any, next: any) => next(),
}))

jest.mock('@/middleware/audit', () => ({
  auditLog: (_req: any, _res: any, next: any) => next(),
}))

jest.mock('@/middleware/twoFactor', () => ({
  requireTwoFactor: (_req: any, _res: any, next: any) => next(),
}))

jest.mock('@/services/cloudinary.service', () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({ url: 'https://example.com/doc.pdf', publicId: 'doc123' }),
}))

import {
  submitKYC,
  getStatus,
  listSubmissions,
  verifyKYC,
} from '@/controllers/kyc.controller'

app.post('/api/v1/kyc/submit', submitKYC)
app.get('/api/v1/kyc/status', getStatus)
app.get('/api/v1/kyc', listSubmissions)
app.patch('/api/v1/kyc/:id/verify', verifyKYC)

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('KYC Controller Integration', () => {
  const userId = new mongoose.Types.ObjectId().toString()
  const adminId = new mongoose.Types.ObjectId().toString()

  describe('POST /api/v1/kyc/submit', () => {
    it('should reject without required fields', async () => {
      const res = await request(app)
        .post('/api/v1/kyc/submit')
        .set('x-user-id', userId)
        .send({})

      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/v1/kyc/status', () => {
    it('should return not submitted status', async () => {
      const res = await request(app)
        .get('/api/v1/kyc/status')
        .set('x-user-id', userId)

      expect(res.status).toBe(200)
      expect(res.body.data.status).toBe('not_submitted')
    })
  })

  describe('GET /api/v1/kyc', () => {
    it('should list KYC submissions for admin', async () => {
      const res = await request(app)
        .get('/api/v1/kyc')
        .set('x-user-id', adminId)
        .set('x-user-role', 'admin')

      expect(res.status).toBe(200)
      expect(res.body.data).toBeDefined()
    })
  })

  describe('PATCH /api/v1/kyc/:id/verify', () => {
    it('should reject verification without admin role', async () => {
      const res = await request(app)
        .patch(`/api/v1/kyc/${new mongoose.Types.ObjectId()}/verify`)
        .set('x-user-id', userId)
        .set('x-user-role', 'user')
        .send({ status: 'verified' })

      expect(res.status).toBe(403)
    })
  })
})
