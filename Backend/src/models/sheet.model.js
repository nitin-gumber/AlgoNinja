import mongoose from 'mongoose';
import { visibility, visibilityEnum } from '../utils/constants.js';

const sheetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 10,
    },
    visibility: {
      type: String,
      enum: visibility,
      default: visibility.PRIVATE,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      lowercase: true,
      trim: true,
      default: [],
    },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    isCloned: {
      type: Boolean,
      default: false,
    },
    clonedFromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sheet',
      default: null,
    },
  },
  { timestamps: true },
);

sheetSchema.index({ visibility: 1, tags: 1 });

sheetSchema.index({ creatorId: 1, createdAt: -1 });

sheetSchema.index({ creatorId: 1, name: 1 }, { unique: true });

export const Sheet = mongoose.model('Sheet', sheetSchema);
