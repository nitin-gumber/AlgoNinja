import mongoose, { Types } from 'mongoose';

const featuredSheetSchema = new mongoose.Schema(
  {
    sheetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sheet',
      required: true,
    },
    pinnedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

featuredSheetSchema.index({ sheetId: 1 });
featuredSheetSchema.index({ isRecommended: 1 });

export const FeaturedSheet = mongoose.model('FeaturedSheet', featuredSheetSchema);
