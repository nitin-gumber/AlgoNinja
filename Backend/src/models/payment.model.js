import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    planName: {
      type: String,
      required: true,
      enum: ['Pro', 'Premium'],
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ['created', 'captured', 'failed', 'refunded'],
      default: 'created',
    },

    capturedAt: {
      type: Date,
    },

    paymentMethod: {
      type: String,
    },

    cardLast4: {
      type: String,
    },

    cardNetwork: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model('Payment', paymentSchema);
