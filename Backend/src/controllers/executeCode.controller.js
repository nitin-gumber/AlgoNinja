import { Submission } from '../models/submission.model.js';
import { User } from '../models/user.model.js';
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
  getJudge0LanguageName,
} from '../utils/judge0.js';

const evaluatedCode = async ({ source_code, language_id, stdin, expected_outputs }) => {
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    throw new Error('Invalid or missing test cases');
  }

  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  const submitResponse = await submitBatch(submissions);

  const tokens = submitResponse.map((result) => result.token);

  const results = await pollBatchResults(tokens);

  let allPassed = true;
  let overallStatus = 'Accepted';
  let maxMemory = 0;
  let maxTime = 0;
  let criticalError = null;

  const detailedResults = results.map((result, index) => {
    const stdout = (result.stdout || '').trim();
    const expected_output = (expected_outputs[index] || '').trim();

    const isJudge0Accepted = result.status?.id === 3;
    const passed = isJudge0Accepted && stdout === expected_output;

    if (!passed) {
      allPassed = false;

      const currentStatusDesc = result.status?.description || `Wrong Answer`;

      if (!isJudge0Accepted) {
        if (!criticalError) {
          criticalError = currentStatusDesc;
        }
      } else {
        if (!criticalError || criticalError === 'Wrong Answer') {
          criticalError = `Wrong Answer`;
        }
      }
    }

    if (result.memory > maxMemory) maxMemory = result.memory;
    if (result.time) {
      const parsedTime = parseFloat(result.time);
      if (parsedTime > maxTime) maxTime = parsedTime;
    }

    return {
      testCaseNumber: index + 1,
      passed,
      stdout: result.stdout || null,
      expected: expected_output,
      stderr: result.stderr || null,
      compileOutput: result.compile_output || null,
      status: result.status.description || 'Error',
      memory: result.memory ? `${result.memory} KB` : null,
      time: result.time ? `${result.time} s` : null,
    };
  });

  if (!allPassed && criticalError) {
    overallStatus = criticalError;
  }

  return {
    detailedResults,
    allPassed,
    overallStatus,
    maxMemory: maxMemory ? `${maxMemory} KB` : `0 KB`,
    maxTime: maxTime ? `${maxTime} s` : `0 s`,
  };
};

export const runCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs } = req.body;

    const { detailedResults, allPassed, overallStatus, maxMemory, maxTime } = await evaluatedCode({
      source_code,
      language_id,
      stdin,
      expected_outputs,
    });

    return res.status(200).json({
      success: true,
      message: 'Code executed Successfully! (Dry Run)!',
      allPassed,
      overallStatus,
      runtimeMetrics: { memory: maxMemory, time: maxTime },
      testCases: detailedResults,
    });
  } catch (error) {
    console.error('runCode Failed: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error When runCode the Problem',
    });
  }
};

export const submitCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;

  const userId = req.user.id;

  try {
    const { detailedResults, allPassed, overallStatus, maxMemory, maxTime } = await evaluatedCode({
      source_code,
      language_id,
      stdin,
      expected_outputs,
    });

    const language = await getJudge0LanguageName(language_id);

    if (!language) {
      return res.status(400).json({
        success: false,
        message: `Language ID ${language_id} not found in Judge0`,
      });
    }

    const languageName = language.name;

    const submission = await Submission.create({
      userId: userId,
      problemId: problemId,
      sourceCode: source_code,
      language: languageName,
      status: allPassed ? `Accepted` : overallStatus,
      memory: maxMemory,
      time: maxTime,
      testCases: detailedResults,
    });

    let currentStreak = 0;
    let highestStreak = 0;

    if (allPassed) {
      const user = await User.findById(userId);

      if (user) {
        const isProblemUnique = !user.solvedProblems.includes(problemId);

        if (isProblemUnique) {
          user.solvedProblems.push(problemId);

          const updatedUser = processUserStreak(user);
          await updatedUser.save();

          currentStreak = updatedUser.streakCount;
          highestStreak = updatedUser.highestStreak;
        } else {
          currentStreak = user.streakCount;
          highestStreak = user.highestStreak;
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: allPassed
        ? `Congratulations! Problem Solved Successfully.`
        : `Submission processed with errors`,
      submissionId: submission._id,
      status: submission.status,
      runtimeMetrics: {
        memory: submission.memory,
        time: submission.time,
      },
      streakMetrics: {
        streakCount: currentStreak,
        highestStreak: highestStreak,
      },
      testCases: detailedResults,
    });
  } catch (error) {
    console.error('SubmitCode Failed', error);
    return res.status(500).json({
      success: false,
      message: error.message || `Internal Server Error when submitting solution`,
    });
  }
};
