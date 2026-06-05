import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Tenant from '@/models/Tenant'
import * as tenantService from '@/services/tenant.service'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Tenant Service', () => {
  const tenantData = {
    name: 'Test Tenant',
    slug: 'test-tenant',
    plan: 'starter' as const,
    contactEmail: 'admin@testtenant.com',
  }

  it('should create a tenant', async () => {
    const tenant = await tenantService.createTenant(tenantData)
    expect(tenant.name).toBe(tenantData.name)
    expect(tenant.slug).toBe(tenantData.slug)
    expect(tenant.plan).toBe('starter')
    expect(tenant.status).toBe('active')
  })

  it('should reject duplicate slug', async () => {
    await expect(tenantService.createTenant(tenantData)).rejects.toThrow(
      'Tenant slug already exists'
    )
  })

  it('should get tenant by id', async () => {
    const created = await Tenant.findOne({ slug: 'test-tenant' })
    const tenant = await tenantService.getTenantById(created!._id.toString())
    expect(tenant.name).toBe(tenantData.name)
  })

  it('should throw 404 for non-existent tenant', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    await expect(tenantService.getTenantById(fakeId)).rejects.toThrow(
      'Tenant not found'
    )
  })

  it('should get tenant by slug', async () => {
    const tenant = await tenantService.getTenantBySlug('test-tenant')
    expect(tenant).not.toBeNull()
    expect(tenant!.name).toBe(tenantData.name)
  })

  it('should return null for inactive tenant slug', async () => {
    await Tenant.findOneAndUpdate({ slug: 'test-tenant' }, { isActive: false })
    const tenant = await tenantService.getTenantBySlug('test-tenant')
    expect(tenant).toBeNull()
    await Tenant.findOneAndUpdate({ slug: 'test-tenant' }, { isActive: true })
  })

  it('should update tenant', async () => {
    const created = await Tenant.findOne({ slug: 'test-tenant' })
    const updated = await tenantService.updateTenant(created!._id.toString(), {
      name: 'Updated Tenant',
    })
    expect(updated!.name).toBe('Updated Tenant')
  })

  it('should suspend tenant', async () => {
    const created = await Tenant.findOne({ slug: 'test-tenant' })
    const suspended = await tenantService.suspendTenant(created!._id.toString())
    expect(suspended!.status).toBe('suspended')
  })

  it('should activate tenant', async () => {
    const created = await Tenant.findOne({ slug: 'test-tenant' })
    const activated = await tenantService.activateTenant(created!._id.toString())
    expect(activated!.status).toBe('active')
  })

  it('should list tenants with pagination', async () => {
    const result = await tenantService.listTenants({ page: 1, limit: 10 })
    expect(result.data.length).toBeGreaterThanOrEqual(1)
    expect(result.pagination.page).toBe(1)
    expect(result.pagination.total).toBeGreaterThanOrEqual(1)
  })
})
