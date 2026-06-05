import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('User Model', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890',
  }

  it('should create a user successfully', async () => {
    const user = await User.create(userData)
    expect(user.name).toBe(userData.name)
    expect(user.email).toBe(userData.email)
    expect(user.role).toBe('user')
    expect(user.isVerified).toBe(false)
    expect(user.isActive).toBe(true)
  })

  it('should hash password before saving', async () => {
    const user = await User.create({ ...userData, email: 'hash@example.com' })
    const userWithPassword = await User.findById(user._id).select('+password')
    expect(userWithPassword?.password).not.toBe(userData.password)
    const isMatch = await bcrypt.compare(userData.password, userWithPassword!.password)
    expect(isMatch).toBe(true)
  })

  it('should compare password correctly', async () => {
    const user = await User.create({ ...userData, email: 'compare@example.com' })
    const userWithPassword = await User.findById(user._id).select('+password')
    const isMatch = await userWithPassword!.comparePassword(userData.password)
    expect(isMatch).toBe(true)
    const isNotMatch = await userWithPassword!.comparePassword('wrongpassword')
    expect(isNotMatch).toBe(false)
  })

  it('should generate auth token', async () => {
    const user = await User.create({ ...userData, email: 'token@example.com' })
    const token = user.generateAuthToken()
    expect(typeof token).toBe('string')
    const decoded = jwt.decode(token) as { _id: string; role: string }
    expect(decoded._id).toBe(user._id.toString())
    expect(decoded.role).toBe('user')
  })

  it('should generate refresh token', async () => {
    const user = await User.create({ ...userData, email: 'refresh@example.com' })
    const token = user.generateRefreshToken()
    expect(typeof token).toBe('string')
    const decoded = jwt.decode(token) as { _id: string; role: string }
    expect(decoded._id).toBe(user._id.toString())
  })

  it('should not allow duplicate email', async () => {
    await User.create(userData)
    await expect(User.create({
      ...userData,
      email: 'test@example.com',
    })).rejects.toThrow()
  })

  it('should enforce required fields', async () => {
    await expect(User.create({})).rejects.toThrow()
  })

  it('should validate email format', async () => {
    await expect(User.create({
      ...userData,
      email: 'invalid-email',
    })).rejects.toThrow()
  })
})
