import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getJudge0LanguageId = (language) => {
  const LanguageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return LanguageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  try {
    const { data } = await axios.post(
      `${process.env.JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      },
    );
    return data;
  } catch (error) {
    console.error(
      'Error submitting to Judge0 API: ',
      error.response ? error.response.data : error.message,
    );
    throw new Error('Failed to submit code to Judge0 API');
  }
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const pollBatchResults = async (tokens) => {
  
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    const { data } = await axios.get(`${process.env.JUDGE0_BASE_URL}/submissions/batch`, {
      params: {
        tokens: tokens.join(','),
        base64_encoded: false,
      },
    });

    const results = data.submissions;

    const isAllDone = results.every((result) => result.status.id !== 1 && result.status.id !== 2);

    if (isAllDone) return results;

    attempts++;

    await sleep(1000);
  }
  
  throw new Error('Judge0 polling timed out');

};
