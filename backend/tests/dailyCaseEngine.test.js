import test from 'node:test';
import assert from 'node:assert/strict';
import { selectDailyCase, evaluateAccusation, createShareText } from '../dailyCaseEngine.js';

test('selectDailyCase returns a case for a given day key', () => {
  const first = selectDailyCase('2026-06-26');
  const second = selectDailyCase('2026-06-26');
  assert.equal(first.id, second.id);
  assert.ok(first.title);
});

test('evaluateAccusation marks a correct accusation', () => {
  const caseData = {
    solution: { suspectId: 'suspect_a', evidenceId: 'evidence_b', motiveId: 'motive_c' }
  };

  const result = evaluateAccusation(caseData, {
    suspectId: 'suspect_a',
    evidenceId: 'evidence_b',
    motiveId: 'motive_c'
  });

  assert.equal(result.correct, true);
  assert.equal(result.message, 'Case cracked. The evidence locks together.');
});

test('createShareText formats a compact score card', () => {
  const text = createShareText({
    title: 'The Midnight Ledger',
    streak: 4,
    solveTime: '00:03:12',
    accuracy: 'Perfect'
  });

  assert.match(text, /The Midnight Ledger/);
  assert.match(text, /Streak 4/);
});
