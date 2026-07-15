import dayjs from 'dayjs';

export const processUserStreak = (user) => {
  const today = dayjs().startOf('day');

  if (!user.lastSolvedDate) {
    user.streakCount = 1;
    user.highestStreak = 1;
    user.lastSolvedDate = today.toDate();
    return user;
  }

  const lastSolved = dayjs(user.lastSolvedDate).startOf('day');
  const dayDifference = today.diff(lastSolved, 'day');

  if (dayDifference === 0) {
    return user;
  } else if (dayDifference === 1) {
    user.streakCount += 1;
    if (user.streakCount > user.highestStreak) {
      user.highestStreak = user.streakCount;
    }
    user.lastSolvedDate = today.toDate();
  } else {
    user.streakCount = 1;
    user.lastSolvedDate = today.toDate();
  }

  return user;
};