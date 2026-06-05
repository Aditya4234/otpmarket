import EmailTemplate from '@/models/EmailTemplate';
import { ApiError } from '@/utils/apiResponse';
import { sendEmail } from './email.service';

const DEFAULT_TEMPLATES = [
  {
    name: 'Welcome Email',
    slug: 'welcome',
    category: 'auth' as const,
    subject: 'Welcome to OTPMart!',
    body: 'Hi {{name}},\n\nWelcome to OTPMart! Your account has been created successfully.\n\nGet started by exploring our services.\n\nBest,\nOTPMart Team',
    variables: ['name', 'email'],
  },
  {
    name: 'OTP Verification',
    slug: 'otp_verification',
    category: 'auth' as const,
    subject: 'Your OTP Code',
    body: 'Hi {{name}},\n\nYour OTP code is: {{otp}}\n\nThis code expires in 10 minutes.\n\nBest,\nOTPMart Team',
    variables: ['name', 'otp'],
  },
  {
    name: 'Order Confirmation',
    slug: 'order_confirmation',
    category: 'order' as const,
    subject: 'Order Confirmed - #{{orderId}}',
    body: 'Hi {{name}},\n\nYour order #{{orderId}} has been confirmed.\n\nService: {{service}}\nQuantity: {{quantity}}\nTotal: {{total}}\n\nBest,\nOTPMart Team',
    variables: ['name', 'orderId', 'service', 'quantity', 'total'],
  },
  {
    name: 'Payment Received',
    slug: 'payment_received',
    category: 'payment' as const,
    subject: 'Payment Received - {{amount}}',
    body: 'Hi {{name}},\n\nWe have received your payment of {{amount}}.\n\nTransaction ID: {{transactionId}}\n\nBest,\nOTPMart Team',
    variables: ['name', 'amount', 'transactionId'],
  },
  {
    name: 'KYC Approved',
    slug: 'kyc_approved',
    category: 'kyc' as const,
    subject: 'KYC Verification Approved',
    body: 'Hi {{name}},\n\nYour KYC verification has been approved. You can now access all features.\n\nBest,\nOTPMart Team',
    variables: ['name'],
  },
  {
    name: 'Password Reset',
    slug: 'password_reset',
    category: 'auth' as const,
    subject: 'Reset Your Password',
    body: 'Hi {{name}},\n\nClick the link below to reset your password:\n{{resetLink}}\n\nThis link expires in 1 hour.\n\nBest,\nOTPMart Team',
    variables: ['name', 'resetLink'],
  },
];

export const seedDefaultTemplates = async () => {
  for (const template of DEFAULT_TEMPLATES) {
    await EmailTemplate.findOneAndUpdate(
      { slug: template.slug },
      {
        ...template,
        htmlBody: template.body.replace(/\n/g, '<br/>'),
        design: {
          headerColor: '#3b82f6',
          footerColor: '#1e293b',
          buttonColor: '#3b82f6',
          footerText: '© {{year}} OTPMart. All rights reserved.',
        },
        isDefault: true,
        isEditable: true,
      },
      { upsert: true }
    );
  }
};

export const getTemplates = async (category?: string) => {
  const filter: any = { isActive: true };
  if (category) filter.category = category;
  return EmailTemplate.find(filter).sort({ name: 1 });
};

export const getTemplate = async (id: string) => {
  const template = await EmailTemplate.findById(id);
  if (!template) throw new ApiError(404, 'Template not found');
  return template;
};

export const getTemplateBySlug = async (slug: string) => {
  return EmailTemplate.findOne({ slug, isActive: true });
};

export const createTemplate = async (data: any) => {
  return EmailTemplate.create(data);
};

export const updateTemplate = async (id: string, data: any) => {
  const template = await EmailTemplate.findByIdAndUpdate(id, { $set: { ...data, version: 1 } }, { new: true });
  if (!template) throw new ApiError(404, 'Template not found');
  return template;
};

export const deleteTemplate = async (id: string) => {
  const template = await EmailTemplate.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!template) throw new ApiError(404, 'Template not found');
  return template;
};

export const renderTemplate = (template: { subject: string; body: string; htmlBody: string }, variables: Record<string, string>) => {
  let subject = template.subject;
  let body = template.body;
  let htmlBody = template.htmlBody;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, value);
    body = body.replace(regex, value);
    htmlBody = htmlBody.replace(regex, value);
  }

  return { subject, body, htmlBody };
};

export const sendTemplateEmail = async (
  slug: string,
  to: string,
  variables: Record<string, string>
) => {
  const template = await getTemplateBySlug(slug);
  if (!template) throw new ApiError(404, `Template '${slug}' not found`);

  const rendered = renderTemplate(template, variables);

  await sendEmail({
    to,
    subject: rendered.subject,
    html: rendered.htmlBody,
  });

  return { message: 'Email sent successfully' };
};
