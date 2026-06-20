import mongoose from 'mongoose';

export const testCaseResultSchema = new mongoose.Schema(
  {
    testCaseNumber: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    stdout: {
      type: String,
      tim: true,
    },
    expected: {
      type: String,
      required: true,
      trim: true,
    },
    stderr: {
      type: String,
      trim: true,
    },
    compileOutput: {
      type: String,
      trim: true,
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
  },
  { _id: false },
);
