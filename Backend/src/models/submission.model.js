import mongoose from 'mongoose';
import { testCaseResultSchema } from './testCaseResult.model.js';

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    memory: {
      type: String,
    },
    time: {
      type: String,
    },
    testCases: [testCaseResultSchema],
  },
  { timestamps: true },
);

submissionSchema.index({ userId: 1, problemId: 1, createAt: -1 });

export const Submission = mongoose.model('Submission', submissionSchema);
