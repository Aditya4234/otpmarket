import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import ActivityLog from '@/models/ActivityLog'
import FraudAlert from '@/models/FraudAlert'
import * as fraudService from '@/services/fraud.service'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Fraud Detection Service', () => {
  beforeEach(async () => {
    await ActivityLog.deleteMany({})
    await FraudAlert.deleteMany({})
  })

  it('should return low risk score for normal activity', async () => {
    const score = await fraudService.checkForFraud({
      ipAddress: '192.168.1.1',
      action: 'order.create',
      amount: 100,
    })
    expect(score).toBe(0)
  })

  it('should detect rapid fire from single IP', async () => {
    const userId = new mongoose.Types.ObjectId().toString()
    const actions = Array.from({ length: 25 }, (_, i) => ({
      user: userId,
      action: `test.action.${i}`,
      ip: '10.0.0.1',
      userAgent: 'test-agent',
      severity: 'info' as const,
    }))
    await ActivityLog.insertMany(actions)

    const score = await fraudService.checkForFraud({
      userId,
      ipAddress: '10.0.0.1',
      userAgent: 'test-agent',
      action: 'order.create',
      amount: 100,
    })
    expect(score).toBeGreaterThanOrEqual(30)

    const alert = await FraudAlert.findOne({ ruleName: 'rapid_fire' })
    expect(alert).not.toBeNull()
    expect(alert!.severity).toBe('medium')
  })

  it('should detect high amount transactions', async () => {
    const score = await fraudService.checkForFraud({
      ipAddress: '192.168.1.2',
      action: 'payment.process',
      amount: 100000,
    })
    expect(score).toBe(25)

    const alerts = await FraudAlert.find({ ruleName: 'high_amount' })
    expect(alerts.length).toBeGreaterThanOrEqual(1)
  })

  it('should not create alert for moderate risk', async () => {
    const score = await fraudService.checkForFraud({
      ipAddress: '192.168.1.3',
      action: 'payment.process',
      amount: 40000,
    })
    expect(score).toBe(25)

    const alerts = await FraudAlert.find()
    expect(alerts.length).toBe(0)
  })

  it('should list fraud alerts with pagination', async () => {
    const userId = new mongoose.Types.ObjectId().toString()
    await FraudAlert.create({
      user: userId,
      type: 'api_abuse',
      ruleName: 'rapid_fire',
      severity: 'medium',
      ipAddress: '10.0.0.2',
      riskScore: 30,
      description: 'Test alert',
      evidence: {},
    })
    await FraudAlert.create({
      user: userId,
      type: 'payment_fraud',
      ruleName: 'high_amount',
      severity: 'high',
      ipAddress: '10.0.0.3',
      riskScore: 50,
      description: 'Test alert 2',
      evidence: {},
    })

    const result = await fraudService.listFraudAlerts({ page: 1, limit: 10 })
    expect(result.data.length).toBe(2)
    expect(result.pagination.total).toBe(2)
  })

  it('should filter alerts by severity', async () => {
    const result = await fraudService.listFraudAlerts({ severity: 'high' })
    expect(result.data.length).toBe(1)
    expect(result.data[0].severity).toBe('high')
  })

  it('should resolve fraud alert', async () => {
    const alert = await FraudAlert.findOne()
    const resolved = await fraudService.resolveFraudAlert(
      alert!._id.toString(),
      'false_positive',
      new mongoose.Types.ObjectId().toString()
    )
    expect(resolved!.status).toBe('resolved')
    expect(resolved!.resolution).toBe('false_positive')
  })

  it('should get fraud stats', async () => {
    const stats = await fraudService.getFraudStats()
    expect(stats).toHaveProperty('total')
    expect(stats).toHaveProperty('open')
    expect(stats).toHaveProperty('critical')
    expect(stats).toHaveProperty('byType')
  })
})
