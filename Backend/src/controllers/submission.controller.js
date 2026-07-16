import mongoose from 'mongoose';
import { Submission } from '../models/submission.model.js';

export const getAllUserSubmissions = async (req, res) => {
  const userId = req.user.id;

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const submissions = await Submission.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problemDetails',
        },
      },
      {
        $unwind: {
          path: '$problemDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          status: 1,
          language: 1,
          memory: 1,
          time: 1,
          createdAt: 1,
          problem: {
            title: {
              $ifNull: [`$problemDetails.title`, `Deleted Problem`],
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'All Submission fetched Successfully',
      data: submissions || [],
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({
      success: false,
      message: error.message || `Internal Server Error when fetching submissions`,
    });
  }
};

export const getSubmissionForProblem = async (req, res) => {
  const userId = req.user.id;
  const problemId = req.params.problemId;

  try {
    const problemObjectId = new mongoose.Types.ObjectId(problemId);

    if (!problemId || !problemObjectId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing Problem ID format.',
      });
    }

    const submissions = await Submission.find({
      userId: userId,
      problemId: problemObjectId,
    })
      .select('_id status language memory, time testCase createdAt')
      .sort({ createdAt: -1 });

    if (submissions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No submissions found for this problem yet.',
        submissions: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'All user submissions for this problem fetched successfully.',
      submissions,
    });
  } catch (error) {
    console.error('Error in getUserSubmissionsForProblem: ', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching problem submissions',
    });
  }
};

export const getTotalSubmissionsForProblem = async (req, res) => {
  const problemId = req.params.problemId;

  try {
    const problemObjectId = new mongoose.Types.ObjectId(problemId);

    if (!problemId || !problemObjectId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing Problem ID format.',
      });
    }

    const totalSubmissions = await Submission.countDocuments({ problemId });

    return res.status(200).json({
      success: true,
      message: 'Total submissions count for this problem fetched successfully.',
      totalSubmissions: totalSubmissions || 0,
    });
  } catch (error) {
    console.error('Error in getTotalSubmissionsForProblem:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while calculating submission stats',
    });
  }
};
