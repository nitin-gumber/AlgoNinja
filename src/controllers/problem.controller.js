import { User } from '../models/user.model.js';
import { Problem } from '../models/problem.model.js';
import { userRoleEnum } from '../utils/constants.js';
import { getJudge0LanguageId, submitBatch, pollBatchResults } from '../utils/judge0.js';

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

  if (req.user.role !== userRoleEnum.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied! Only admins can create problems.',
    });
  }

  try {
    const existingProblem = await Problem.findOne({ title: title.toLowerCase().trim() });
    if (existingProblem) {
      return res.status(400).json({
        success: false,
        message: 'Problem with this title already exists!',
      });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Language ${language} is not supported yet!`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((results) => results.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        console.log(
          `Testcase ${i + 1} for language ${language} ------ result ${JSON.stringify(result)} `,
        );

        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await Problem.create({
      title: title,
      description: description,
      difficulty: difficulty,
      tags: tags,
      examples: examples,
      constraints: constraints,
      hints: hints,
      editorial: editorial,
      testcases: testcases,
      codeSnippets: codeSnippets,
      referenceSolutions: referenceSolutions,
      problemCreatedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Problem Created Successfully',
      problem: newProblem,
    });
  } catch (error) {
    console.error('createProblem Failed: ', error);

    if (error.message === 'Judge0 polling timed out') {
      return res.status(408).json({
        success: false,
        message: 'Judge0 server is taking too long to respond. Please try again after some time.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When create Problem',
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});

    console.log('Problems', problems);

    if (problems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Problems not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'All Problems Fetched Successfully',
      problems,
    });
  } catch (error) {
    console.error('getAllProblems Failed: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When get All Problems',
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Problem Fetched Successfully',
      problem,
    });
  } catch (error) {
    console.error('getProblemById Failed: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When get Problem by Id',
    });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;

  console.log('Id', id);

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

  if (req.user.role !== userRoleEnum.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied! You are not allowed to update a problem',
    });
  }

  try {
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem Not Found',
      });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Language ${language} is not supported yet!`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((results) => results.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        console.log(
          `Testcase ${i + 1} for language ${language} ------ result ${JSON.stringify(result)} `,
        );

        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        difficulty: difficulty,
        tags: tags,
        examples: examples,
        constraints: constraints,
        hints: hints,
        editorial: editorial,
        testcases: testcases,
        codeSnippets: codeSnippets,
        referenceSolutions: referenceSolutions,
      },
      { new: true, runValidators: true },
    );

    res.status(201).json({
      success: true,
      message: 'Problem Updated Successfully',
    });
  } catch (error) {
    console.error('updateProblem Failed: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error update the Problem',
    });
  }
};
