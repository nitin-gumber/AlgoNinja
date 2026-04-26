import mongoose from 'mongoose';
import { availableUserRoles } from '../utils/constants.js';
import { userRoleEnum } from '../utils/constants.js';
import { plans } from '../utils/constants.js';
import { planEnum } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      immutable: true,
      trim: true,
    },

    image: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: availableUserRoles,
      default: userRoleEnum.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
    },

    verificationTokenExpiry: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetTokenExpiry: {
      type: Date,
    },

    refreshToken: {
      type: String,
    },

    plan: {
      type: String,
      enum: plans,
      default: planEnum.FREE,
    },

    planActivedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
