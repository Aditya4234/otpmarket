import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '@/config/env';

interface CreateOrderParams {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

interface CreateOrderResult {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  notes?: Record<string, string>;
}

interface VerifySignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

const razorpayInstance = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export async function createRazorpayOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  try {
    const order = await razorpayInstance.orders.create({
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes,
      payment_capture: 1 as any,
    }) as any;

    return {
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      currency: order.currency as string,
      receipt: order.receipt as string,
      status: order.status as string,
      notes: order.notes as Record<string, string> | undefined,
    };
  } catch (error) {
    throw new Error(
      `Failed to create Razorpay order: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export function verifyRazorpaySignature(params: VerifySignatureParams): boolean {
  const { orderId, paymentId, signature } = params;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export async function fetchPayment(paymentId: string): Promise<Record<string, unknown>> {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return payment as unknown as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      `Failed to fetch Razorpay payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function refundPayment(
  paymentId: string,
  amount?: number,
): Promise<Record<string, unknown>> {
  try {
    const refund = await razorpayInstance.payments.refund(paymentId, {
      amount,
    });
    return refund as unknown as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      `Failed to refund Razorpay payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
