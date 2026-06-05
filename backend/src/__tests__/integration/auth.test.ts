import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import express from 'express'
import request from 'supertest'
import User from '@/models/User'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

jest.mock('@/services/email.service', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}))

jest.mock('@/config/env', () => ({
  env: {
    PORT: 5000,
    NODE_ENV: 'development',
    JWT_SECRET: 'test_jwt_secret',
    JWT_REFRESH_SECRET: 'test_jwt_refresh_secret',
    JWT_EXPIRE: '15m',
    JWT_REFRESH_EXPIRE: '7d',
    CLIENT_URL: 'http://localhost:3000',
  },
  isDevelopment: true,
  isProduction: false,
}))

jest.mock('@/middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { _id: req.headers['x-user-id'] || '000000000000000000000001', role: 'user' }
    next()
  },
  authorize: (..._roles: string[]) => (_req: any, _res: any, next: any) => {
    next()
  },
}))

jest.mock('@/middleware/tenant', () => ({
  resolveTenant: (_req: any, _res: any, next: any) => next(),
}))

jest.mock('@/middleware/twoFactor', () => ({
  requireTwoFactor: (_req: any, _res: any, next: any) => next(),
}))

jest.mock('@/middleware/audit', () => ({
  auditLog: (_req: any, _res: any, next: any) => next(),
}))

import { register, login, logout, getMe, verifyEmail, changePassword } from '@/controllers/auth.controller'

app.post('/api/v1/auth/register', register)
app.post('/api/v1/auth/login', login)
app.post('/api/v1/auth/logout', logout)
app.get('/api/v1/auth/me', getMe)
app.post('/api/v1/auth/verify-email', verifyEmail)
app.post('/api/v1/auth/change-password', changePassword)

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Auth Controller Integration', () => {
  const testUser = {
    name: 'Integration Test User',
    email: 'integration@test.com',
    password: 'password123',
    phone: '9876543210',
  }

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.user.name).toBe(testUser.name)
      expect(res.body.data.user.email).toBe(testUser.email)
      expect(res.body.data.accessToken).toBeDefined()
    })

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)

      expect(res.status).toBe(409)
    })

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Incomplete' })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.accessToken).toBeDefined()
      expect(res.body.data.user.email).toBe(testUser.email)
    })

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })

      expect(res.status).toBe(401)
    })

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'password123' })

      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/v1/auth/me', () => {
    it('should return authenticated user', async () => {
      const user = await User.findOne({ email: testUser.email })
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('x-user-id', user!._id.toString())

      expect(res.status).toBe(200)
      expect(res.body.data.user.email).toBe(testUser.email)
    })
  })

  describe('POST /api/v1/auth/verify-email', () => {
    it('should verify email with correct OTP', async () => {
      const user = await User.findOne({ email: testUser.email })
      await User.findByIdAndUpdate(user!._id, {
        otp: 123456,
        otpExpiry: new Date(Date.now() + 600000),
      })

      const res = await request(app)
        .post('/api/v1/auth/verify-email')
        .set('x-user-id', user!._id.toString())
        .send({ otp: '123456' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Email verified successfully')
    })

    it('should reject invalid OTP', async () => {
      const user = await User.findOne({ email: testUser.email })
      const res = await request(app)
        .post('/api/v1/auth/verify-email')
        .set('x-user-id', user!._id.toString())
        .send({ otp: '000000' })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/v1/auth/change-password', () => {
    it('should change password with correct current password', async () => {
      const user = await User.findOne({ email: testUser.email })
      const res = await request(app)
        .post('/api/v1/auth/change-password')
        .set('x-user-id', user!._id.toString())
        .send({ currentPassword: testUser.password, newPassword: 'newpassword123' })

      expect(res.status).toBe(200)
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')

      expect(res.status).toBe(200)
    })
  })
})
