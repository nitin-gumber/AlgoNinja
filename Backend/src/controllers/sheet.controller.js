import mongoose from 'mongoose';
import { Sheet } from '../models/sheet.model.js';
import { visibility } from '../utils/constants.js';
import { Problem } from '../models/problem.model.js';
import { User } from '../models/user.model.js';
import { visibilityEnum } from '../utils/constants.js';
import { FeaturedSheet } from '../models/featuredSheet.model.js';
import { userRoleEnum } from '../utils/constants.js';

export const createSheet = async (req, res) => {
  const { name, description, sheetVisibility, tags, problems } = req.body;

  const userId = req.user.id;

  try {
    const normalizedName = name.trim();

    const normalizedTags = tags
      .map((tag) => tag.toLowerCase().trim())
      .filter((tag) => tag.length > 0);

    if (normalizedTags.length === 0) {
      return res.status(400).json({
        success: true,
        message: 'At least one valid tag is required',
      });
    }

    const isDuplicate = await Sheet.findOne({
      creatorId: userId,
      name: { $regex: `^${normalizedName}`, $options: 'i' },
    });

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: `you already have a playlist sheet named "${normalizedName}". Please choose a different name.`,
      });
    }

    if (problems.length > 0) {
      const validObjectIds = problems.filter((id) => mongoose.Types.ObjectId.isValid(id));

      if (validObjectIds.length !== problems.length) {
        return res
          .status(400)
          .json({ success: false, message: 'One or more problem IDs have an invalid format.' });
      }

      const existingProblemCount = await Problem.countDocuments({ _id: { $in: validObjectIds } });

      if (existingProblemCount !== problems.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more problem IDs do not exist in the database.',
        });
      }
    }

    const newSheet = await Sheet.create({
      name: normalizedName,
      description: description?.trim(),
      visibility: sheetVisibility,
      creatorId: userId,
      tags: normalizedTags,
      problems,
    });

    res.status(201).json({
      success: true,
      message: 'Coding Sheet Playlist created successfully',
      sheet: newSheet,
    });
  } catch (error) {
    console.error('Error inside createSheet logic:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while creating coding playlist',
    });
  }
};

export const getSheet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Sheet ID format',
      });
    }

    const sheet = await Sheet.findById(id).populate('creatorId', 'name');

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: 'Coding Sheet not found',
      });
    }

    if (sheet.visibility === visibilityEnum.PRIVATE && sheet.creatorId._id.toString() !== userId) {
      return res.status(402).json({
        success: false,
        message: 'Unauthorized to view this private sheet',
      });
    }

    const totalProblems = sheet.problems ? sheet.problems.length : 0;
    let solvedProblemsCount = 0;

    if (totalProblems > 0) {
      const user = await User.findById(userId).select('solvedProblems');
      const userSolvedSet = new Set(user?.solvedProblems.map((oid) => oid.toString()));

      sheet.problems.forEach((problemId) => {
        if (userSolvedSet.has(problemId.toString())) {
          solvedProblemsCount++;
        }
      });
    }

    const percentage = totalProblems > 0 ? (solvedProblemsCount / totalProblems) * 100 : 0;

    return res.status(200).json({
      success: true,
      message: 'Sheet fetched successfully',
      sheet: {
        id: sheet.Id,
        name: sheet.name,
        description: sheet.description,
        visibility: sheet.visibility,
        tags: sheet.tags,
        creator: { name: sheet.creatorId?.name || 'Unknown' },
        creatorId: sheet.creatorId?._id,
        createdAt: sheet.createdAt,
        updatedAt: sheet.updatedAt,
        totalProblems,
        problems: sheet.problems,
        progress: {
          solved: solvedProblemsCount,
          total: totalProblems,
          percentage: Number(percentage.toFixed(1)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching sheet details:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error when fetching playlist data',
    });
  }
};

export const updateSheet = async (req, res) => {
  const sheetId = req.params.id;
  const { name, description, sheetVisibility, tags, problems } = req.body;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(sheetId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Sheet ID format.',
      });
    }

    const sheet = await Sheet.findById(sheetId);

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found.',
      });
    }

    if (sheet.creatorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this coding sheet.',
      });
    }

    const updateData = {};

    if (name) {
      const normalizedName = name.trim();

      const isDupliacteName = await Sheet.findOne({
        _id: { $ne: sheetId },
        creatorId: userId,
        name: { $regex: `^${normalizedName}$`, $options: 'i' },
      });

      if (isDupliacteName) {
        return res.status(400).json({
          success: false,
          message: `You already have another playlist named "${normalizedName}". Please choose a unique name.`,
        });
      }

      updateData.name = normalizedName;
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : '';
    }

    if ((sheet.isCloned || updateData.isCloned) && visibility === visibilityEnum.PUBLIC) {
      return res.status(400).json({
        success: false,
        message: 'Cloned template playlists cannot be configured as public index.',
      });
    }

    if (tags) {
      const normalizedTags = tags
        .map((tag) => tag.toLowerCase().trim())
        .filter((tag) => tag.length > 0);

      if (normalizedTags.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one valid non-empty tag element is required.',
        });
      }
      updateData.tags = normalizedTags;
    }

    if (problems) {
      if (problems.length > 0) {
        const validObjectIds = problems.filter((pid) => mongoose.Types.ObjectId.isValid(pid));

        if (validObjectIds.length !== problems.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more Problem IDs contain an invalid format structure.',
          });
        }

        const existingProblemsCount = await Problem.countDocuments({
          _id: { $in: validObjectIds },
        });

        if (existingProblemsCount !== problems.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more updated problem IDs do not exist in system indexes.',
          });
        }
      }

      updateData.problems = problems;
    }

    const updatedSheet = await Sheet.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: 'Sheet updated successfully',
      sheet: updatedSheet,
    });
  } catch (error) {
    console.error('Error inside updateSheet controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while executing spreadsheet updates',
    });
  }
};

export const deleteSheet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Sheet ID format.',
      });
    }

    const sheet = await Sheet.findById(id);

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found.',
      });
    }

    if (sheet.creatorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized! You do not own this playlist.',
      });
    }

    await sheet.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sheet Playlist deleted successfully.',
    });
  } catch (error) {
    console.error('Error inside deleteSheet controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while deleting sheet profile data.',
    });
  }
};

export const getSheetProblems = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Sheet ID format.',
      });
    }

    const sheet = await Sheet.findById(id)
      .select('visibility creatorId problems')
      .populate({
        path: 'problems',
        select: '_id title difficulty tags description',
        options: {
          skip: skip,
          limit: limit,
        },
      });

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found.',
      });
    }

    if (sheet.visibility === 'PRIVATE' && sheet.creatorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this private playlist.',
      });
    }

    const totalProblems = await Sheet.findById(id).select('problems');
    const totalCount = totalProblems?.problems ? totalProblems.problems.length : 0;

    res.status(200).json({
      success: true,
      message: 'Sheet problems fetched successfully.',
      problems: sheet.problems || [],
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error in getSheetProblems:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while computing sheet arrays.',
    });
  }
};

export const addProblemToSheet = async (req, res) => {
  const { sheetId, problemId } = req.body;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(sheetId) || !mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format for Sheet ID or Problem ID.',
      });
    }

    const problemExists = await Problem.findById(problemId).select('_id');

    if (!problemExists) {
      return res.status(404).json({
        success: false,
        message: 'The problem you are trying to add does not exist.',
      });
    }

    const updateSheet = await Sheet.findOneAndUpdate(
      {
        _id: sheetId,
        creatorId: userId,
      },
      {
        $addToSet: { problems: problemId },
      },
      {
        new: true,
        select: '_id name problems',
      },
    );

    if (!updateSheet) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found or you do not have permission to modify this playlist.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Problem synchronized and added to sheet successfully.',
      sheet: updatedSheet,
    });
  } catch (error) {
    console.error('Error inside addProblemToSheet controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while pushing problem reference.',
    });
  }
};

export const removeProblemFromSheet = async (req, res) => {
  const { sheetId, problemId } = req.params;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(sheetId) || !mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format for Sheet ID or Problem ID.',
      });
    }

    const updatedSheet = await Sheet.findOneAndUpdate(
      {
        _id: sheetId,
        problems: problemId,
        creatorId: userId,
      },
      {
        $pull: problemId,
      },
      {
        new: true,
        select: '_id name problems',
      },
    );

    if (!updatedSheet) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found, unauthorized modification, or problem already removed.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Problem removed from sheet playlist successfully.',
      sheet: updatedSheet,
    });
  } catch (error) {
    console.error('Error inside removeProblemFromSheet:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while executing array extraction.',
    });
  }
};

export const getUserSheets = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('solvedProblems');

    const userSolvedSet = new Set(
      userWithSolvedProblems?.solvedProblems.map((id) => id.toString()),
    );

    const sheets = await Sheet.find({ creatorId: userId })
      .populate('creatorId', 'name')
      .sort({ createdAt: -1 });

    const allUserSheet = sheets.map((sheet) => {
      const totalProblems = sheet.problems ? sheet.problems.length : 0;

      let solvedProblemsCount = 0;

      if (totalProblems > 0) {
        sheets.problems.forEach((problemId) => {
          if (userSolvedSet.has(problemId.toString())) {
            solvedProblemsCount++;
          }
        });
      }

      const percentage = totalProblems > 0 ? (solvedProblemsCount / totalProblems) * 100 : 0;

      return {
        id: sheet._id,
        name: sheet.name,
        description: sheet?.description,
        visibility: sheet.visibility,
        tags: sheet.tags,
        creator: { name: sheet.creatorId?.name || 'Unknown' },
        isCloned: sheet.isCloned,
        createdAt: sheet.createdAt,
        updatedAt: sheet.updatedAt,
        totalProblems,
        progress: {
          solved: solvedProblemsCount,
          total: totalProblems,
          percentage: Number(percentage.toFixed(1)),
        },
      };
    });

    res.status(200).json({
      success: true,
      message: 'User sheets fetched successfully.',
      sheets: allUserSheet,
    });
  } catch (error) {
    console.error('Error inside getUserSheets controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while aggregating dashboard stats.',
    });
  }
};

export const getPublicSheets = async (req, res) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 15);
    const skipNum = (pageNum - 1) * limitNum;

    const queryFilter = { visibility: 'public' };

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');

      console.log('SearchRegex:', searchRegex);

      queryFilter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    const featuredDocs = await FeaturedSheet.find({ isRecommended: true }).select('sheetId');
    const featuredSheetIds = new Set(featuredDocs.map((fd) => fd.sheetId.toString()));

    const sheets = await Sheet.find(queryFilter)
      .select('_id name description visibility tags problems creatorId createdAt updatedAt')
      .populate('creatorId', 'name')
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    console.log('Sheets', sheets);

    const totalCount = await Sheet.countDocuments(queryFilter);

    const transformedSheets = sheets.map((sheet) => {
      const isRecommended = featuredSheetIds.has(sheet._id.toString());
      return {
        id: sheet._id,
        name: sheet.name,
        description: sheet.description,
        visibility: sheet.visibility,
        tags: sheet.tags,
        creator: { name: sheet.creatorId?.name || 'Unknown' },
        createdAt: sheet.createdAt,
        updatedAt: sheet.updatedAt,
        totalProblems: sheet.problems ? sheet.problems.length : 0,
        isRecommended,
      };
    });

    console.log('TransformedSheet', transformedSheets);

    transformedSheets.sort((a, b) => b.isRecommended - a.isRecommended);

    res.status(200).json({
      success: true,
      message: 'Public sheets fetched successfully.',
      sheets: transformedSheets,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error inside getPublicSheets controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while indexing public catalogs.',
    });
  }
};

export const cloneSheet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source Sheet ID format.',
      });
    }

    const originalSheet = await Sheet.findById(id).select(
      'name description visibility tags problems',
    );

    if (!originalSheet) {
      return res.status(404).json({
        success: false,
        message: 'The sheet you want to clone does not exist.',
      });
    }

    if (originalSheet.visibility.toLowerCase() !== 'public') {
      return res.status(403).json({
        success: false,
        message: 'Security Restriction! Only sheets marked with public visibility can be cloned.',
      });
    }

    const alreadyCloned = await Sheet.findOne({
      creatorId: userId,
      clonedFromId: id,
      isCloned: true,
    }).select('_id');

    if (alreadyCloned) {
      return res.status(400).json({
        success: false,
        message: 'Bad Request! You have already cloned this sheet to your personal workspace.',
      });
    }

    const clonedSheetData = await Sheet.create({
      name: `Clone of ${originalSheet.name} || ''`,
      description: originalSheet.description || '',
      visibility: 'private',
      creatorId: userId,
      tags: originalSheet.tags || [],
      problems: originalSheet.problems || [],
      isCloned: true,
      clonedFromId: originalSheet._id,
    });

    const responseSheet = clonedSheetData.toObject();
    responseSheet.creator = 'You';

    return res.status(201).json({
      success: true,
      message: 'Coding Sheet Playlist cloned to your workspace successfully!',
      sheet: responseSheet,
    });
  } catch (error) {
    console.error('Error inside cloneSheet controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while copying catalog arrays.',
    });
  }
};

export const pinSheet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { isRecommended } = req.body;

  try {
    if (req.user.role !== userRoleEnum.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Access denied! Only admins can pin the sheet.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Sheet ID format structural constraint.' });
    }

    const sheet = await Sheet.findById(id).select('visibility name');
    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: 'The specified coding sheet target does not exist.',
      });
    }

    if (sheet.visibility.toLowerCase() !== 'public') {
      return res.status(400).json({
        success: false,
        message:
          'Validation Failure! Only sheets configured with public visibility parameters can be pinned.',
      });
    }

    const featuredSheet = await FeaturedSheet.findOneAndUpdate(
      { sheetId: id },
      {
        $set: {
          isRecommended: isRecommended ?? false,
          pinnedByAdmin: userId,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: 'Sheet workspace status synchronized and pinned successfully.',
      featuredSheet,
      sheet,
    });
  } catch (error) {
    console.error('Error inside pinSheet controller configuration:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while synchronizing admin pins layout.',
    });
  }
};

export const unpinSheet = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== userRoleEnum.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Access denied! Only admins can unpin the sheet.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Sheet ID format specification.' });
    }
    const deletedFeaturedDoc = await FeaturedSheet.findOneAndDelete({ sheetId: id });

    if (!deletedFeaturedDoc) {
      return res.status(404).json({
        success: false,
        message:
          'Resource Fallback! This sheet is not currently featured or has already been unpinned.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sheet successfully unpinned and removed from premium recommendations.',
    });
  } catch (error) {
    console.error('Error inside unpinSheet controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while adjusting admin featured layouts.',
    });
  }
};

export const getFeaturedSheets = async (req, res) => {
  try {
    const featuredDocs = await FeaturedSheet.find({ isRecommended: true }).populate({
      path: 'sheetId',
      select: '_id name description visibility tags problems creatorId createdAt updatedAt',
      match: { visibility: 'public' },
      populate: {
        path: 'creatorId',
        select: 'name',
      },
    });

    const validFeaturedDocs = featuredDocs.filter((doc) => doc.sheetId !== null);

    const sheets = validFeaturedDocs.map((doc) => {
      const sheet = doc.sheetId;
      return {
        id: sheet._id,
        name: sheet.name,
        description: sheet.description || '',
        visibility: sheet.visibility,
        tags: sheet.tags || [],
        creator: { name: sheet.creatorId?.name || 'Unknown' },
        createdAt: sheet.createdAt,
        updatedAt: sheet.updatedAt,
        totalProblems: sheet.problems ? sheet.problems.length : 0,
        isRecommended: true,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Featured premium sheets catalog fetched successfully.',
      count: sheets.length,
      sheets,
    });
  } catch (error) {
    console.error('Error inside getFeaturedSheets controller:', error);
    return res.status(500).json({
      success: false,
      message:
        error.message || 'Internal Server Error while compiling landing page recommendations.',
    });
  }
};
