import KYC, { IKycDocument } from '@/models/KYC';
import User from '@/models/User';
import { ApiError } from '@/utils/apiResponse';
import { uploadToCloudinary } from './cloudinary.service';

export const submitKYC = async (userId: string, data: any) => {
  const existing = await KYC.findOne({ user: userId });
  if (existing?.status === 'verified') throw new ApiError(400, 'KYC already verified');

  const kycData = {
    user: userId,
    ...data,
    status: 'submitted',
  };

  if (existing) {
    Object.assign(existing, kycData);
    return existing.save();
  }

  return KYC.create(kycData);
};

export const uploadKycDocument = async (userId: string, file: any, documentType: string) => {
  const kyc = await KYC.findOne({ user: userId });
  if (!kyc) throw new ApiError(404, 'Submit KYC details first');

  const result = await uploadToCloudinary(file, { folder: 'kyc_documents' });

  kyc.documents.push({
    type: documentType as IKycDocument['type'],
    documentType,
    fileUrl: result.url,
    fileKey: result.publicId,
    status: 'pending',
    metadata: {},
  });

  kyc.status = 'submitted';
  return kyc.save();
};

export const verifyKYC = async (kycId: string, adminId: string, status: 'verified' | 'rejected', rejectionReason?: string) => {
  const kyc = await KYC.findById(kycId);
  if (!kyc) throw new ApiError(404, 'KYC not found');

  kyc.status = status;
  kyc.verifiedBy = adminId as any;
  kyc.verifiedAt = new Date() as any;
  if (rejectionReason) kyc.rejectionReason = rejectionReason;

  if (status === 'verified') {
    await User.findByIdAndUpdate(kyc.user, { isVerified: true });
  }

  return kyc.save();
};

export const getKycStatus = async (userId: string) => {
  return KYC.findOne({ user: userId });
};

export const listKycSubmissions = async (query: any) => {
  const { page = 1, limit = 10, status } = query;
  const filter: any = {};
  if (status) filter.status = status;

  const [kycs, total] = await Promise.all([
    KYC.find(filter).populate('user', 'name email phone').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    KYC.countDocuments(filter),
  ]);

  return {
    data: kycs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
