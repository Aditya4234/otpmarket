import mongoose, { Document, Schema } from 'mongoose';

export interface IKYC extends Document {
  user: mongoose.Types.ObjectId;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  type: 'individual' | 'business';
  fullName: string;
  dateOfBirth?: Date;
  nationality?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  documents: IKycDocument[];
  businessDetails?: {
    businessName: string;
    registrationNumber: string;
    taxId: string;
    businessType: string;
    website?: string;
  };
  verificationMethod: 'manual' | 'automated' | 'video' | 'api';
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;
  expiresAt?: Date;
  riskScore?: number;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IKycDocument {
  type: 'id_proof' | 'address_proof' | 'business_proof' | 'tax_document' | 'selfie' | 'other';
  documentType: string;
  fileUrl: string;
  fileKey: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedAt?: Date;
  rejectionReason?: string;
  metadata: Record<string, any>;
}

const kycSchema = new Schema<IKYC>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'verified', 'rejected'],
      default: 'pending',
    },
    type: { type: String, enum: ['individual', 'business'], default: 'individual' },
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    phoneNumber: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    documents: [
      {
        type: {
          type: String,
          enum: ['id_proof', 'address_proof', 'business_proof', 'tax_document', 'selfie', 'other'],
          required: true,
        },
        documentType: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileKey: { type: String, required: true },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        verifiedAt: { type: Date },
        rejectionReason: { type: String },
        metadata: { type: Schema.Types.Mixed, default: {} },
      },
    ],
    businessDetails: {
      businessName: { type: String },
      registrationNumber: { type: String },
      taxId: { type: String },
      businessType: { type: String },
      website: { type: String },
    },
    verificationMethod: {
      type: String,
      enum: ['manual', 'automated', 'video', 'api'],
      default: 'manual',
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    rejectionReason: { type: String },
    expiresAt: { type: Date },
    riskScore: { type: Number, min: 0, max: 100 },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IKYC>('KYC', kycSchema);
