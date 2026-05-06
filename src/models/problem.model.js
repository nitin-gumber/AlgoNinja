import mongoose from 'mongoose';
import { availableDifficulties, difficultyEnum } from '../utils/constants';

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minLength: 10,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: {
        values: availableDifficulties,
        message: `Difficulty must be one of the following: ${availableDifficulties.join(', ')}`,
      },
      default: difficultyEnum.EASY,
    },

    tags: {
      type: [String],
      default: [],
    },

    examples: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    constraints: {
      type: String,
      required: true,
      trim: true,
    },

    hints: {
      type: String,
      trim: true,
    },

    editorial: {
      type: String,
      trim: true,
    },

    testcases: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    codeSnippets: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    referenceSolutions: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    problemCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

problemSchema.index({ problemCreatedBy: 1 });

export const Problem = mongoose.model('Problem', problemSchema);
