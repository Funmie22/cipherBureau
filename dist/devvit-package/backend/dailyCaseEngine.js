import { dailyCases } from './data/dailyCases.js';

function hashDay(dayKey) {
  let hash = 0;
  for (let i = 0; i < dayKey.length; i += 1) {
    hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function selectDailyCase(dayKey) {
  const index = hashDay(dayKey) % dailyCases.length;
  return dailyCases[index];
}

export function evaluateAccusation(caseData, selection = {}) {
  const isCorrect =
    selection.suspectId === caseData.solution?.suspectId &&
    selection.evidenceId === caseData.solution?.evidenceId &&
    selection.motiveId === caseData.solution?.motiveId;

  return {
    correct: isCorrect,
    message: isCorrect ? 'Case cracked. The evidence locks together.' : 'Not quite. Recheck the clues and try again.'
  };
}

export function createShareText({ title, streak, solveTime, accuracy }) {
  return `🕵️ ${title}\nStreak ${streak}\nSolve Time ${solveTime}\nAccuracy ${accuracy}`;
}
