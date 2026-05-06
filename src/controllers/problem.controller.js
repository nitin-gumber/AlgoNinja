import { User } from '../models/user.model.js';
import { Problem } from '../models/problem.model.js';
import { difficultyEnum } from '../utils/constants.js';

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== difficultyEnum.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied! Only admins can create problems.',
    });
  }



};
