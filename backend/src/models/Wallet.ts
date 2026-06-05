import mongoose, { Document, Schema } from 'mongoose';

export interface IWalletDocument extends Document {
  user: mongoose.Types.ObjectId;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalSpent: number;
  isFrozen: boolean;
  lastTransaction?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWalletDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDeposited: {
      type: Number,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    lastTransaction: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model<IWalletDocument>('Wallet', walletSchema);
export default Wallet;
