import crypto from 'crypto';
import Webhook from '@/models/Webhook';
import { ApiError } from '@/utils/apiResponse';

export const createWebhook = async (userId: string, data: any) => {
  const secret = crypto.randomBytes(16).toString('hex');
  return Webhook.create({
    user: userId,
    tenant: data.tenantId,
    name: data.name,
    url: data.url,
    events: data.events,
    secret,
    headers: data.headers || {},
    maxRetries: data.maxRetries || 3,
    timeout: data.timeout || 5000,
  });
};

export const listWebhooks = async (userId: string) => {
  return Webhook.find({ user: userId, isActive: true });
};

export const updateWebhook = async (webhookId: string, userId: string, data: any) => {
  const webhook = await Webhook.findOneAndUpdate(
    { _id: webhookId, user: userId },
    { $set: data },
    { new: true }
  );
  if (!webhook) throw new ApiError(404, 'Webhook not found');
  return webhook;
};

export const deleteWebhook = async (webhookId: string, userId: string) => {
  const webhook = await Webhook.findOneAndUpdate(
    { _id: webhookId, user: userId },
    { isActive: false },
    { new: true }
  );
  if (!webhook) throw new ApiError(404, 'Webhook not found');
  return webhook;
};

export const triggerWebhook = async (event: string, tenantId: string | undefined, payload: any) => {
  const webhooks = await Webhook.find({
    events: event,
    status: 'active',
    isActive: true,
    ...(tenantId ? { tenant: tenantId } : {}),
  });

  const results = await Promise.allSettled(
    webhooks.map(async (webhook) => {
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      const startTime = Date.now();
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event,
            'X-Webhook-Delivery': crypto.randomUUID(),
            ...webhook.headers,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(webhook.timeout),
        });

        const duration = Date.now() - startTime;
        webhook.deliveries.push({
          event,
          payload,
          status: response.ok ? 'success' : 'failed',
          responseCode: response.status,
          responseBody: await response.text().catch(() => ''),
          attempt: webhook.retryCount + 1,
          duration,
          deliveredAt: new Date(),
        });

        if (response.ok) {
          webhook.lastSuccessAt = new Date();
          webhook.consecutiveFailures = 0;
        } else {
          webhook.lastFailureAt = new Date();
          webhook.lastError = `HTTP ${response.status}`;
          webhook.consecutiveFailures += 1;
        }

        webhook.lastTriggeredAt = new Date();
        webhook.retryCount += 1;

        if (webhook.consecutiveFailures >= 10) {
          webhook.status = 'failed';
        }

        await webhook.save();
        return { webhookId: webhook._id, status: response.ok ? 'success' : 'failed' };
      } catch (error: any) {
        const duration = Date.now() - startTime;
        webhook.deliveries.push({
          event,
          payload,
          status: 'failed',
          error: error.message,
          attempt: webhook.retryCount + 1,
          duration,
          deliveredAt: new Date(),
        });
        webhook.lastFailureAt = new Date();
        webhook.lastError = error.message;
        webhook.consecutiveFailures += 1;
        webhook.retryCount += 1;

        if (webhook.consecutiveFailures >= 10) {
          webhook.status = 'failed';
        }

        await webhook.save();
        return { webhookId: webhook._id, status: 'failed', error: error.message };
      }
    })
  );

  return results;
};

export const regenerateWebhookSecret = async (webhookId: string, userId: string) => {
  const secret = crypto.randomBytes(16).toString('hex');
  const webhook = await Webhook.findOneAndUpdate(
    { _id: webhookId, user: userId },
    { secret },
    { new: true }
  );
  if (!webhook) throw new ApiError(404, 'Webhook not found');
  return { secret };
};
