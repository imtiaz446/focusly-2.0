import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRemainingSeconds,
  formatTimeDisplay,
  calculateXpGained,
  calculateLevelFromXp,
  calculateProjectProgress,
} from './timerLogic';

test('calculateRemainingSeconds accurately subtracts elapsed seconds', () => {
  const start = 1000000;
  const now = start + 30000; // 30 seconds later
  const remaining = calculateRemainingSeconds(start, 1500, now);
  assert.equal(remaining, 1500 - 30);
});

test('calculateRemainingSeconds clamps to 0 when elapsed exceeds remaining', () => {
  const start = 1000000;
  const now = start + 2000000;
  const remaining = calculateRemainingSeconds(start, 500, now);
  assert.equal(remaining, 0);
});

test('formatTimeDisplay pads minutes and seconds with leading zero', () => {
  assert.deepEqual(formatTimeDisplay(1505), { minutes: '25', seconds: '05' });
  assert.deepEqual(formatTimeDisplay(59), { minutes: '00', seconds: '59' });
  assert.deepEqual(formatTimeDisplay(0), { minutes: '00', seconds: '00' });
});

test('calculateXpGained awards base duration plus completion bonus', () => {
  assert.equal(calculateXpGained(25, 20), 120);
  assert.equal(calculateXpGained(45, 20), 200);
});

test('calculateLevelFromXp increments level every 500 XP starting from 1', () => {
  assert.equal(calculateLevelFromXp(0), 1);
  assert.equal(calculateLevelFromXp(499), 1);
  assert.equal(calculateLevelFromXp(500), 2);
  assert.equal(calculateLevelFromXp(1480), 3);
  assert.equal(calculateLevelFromXp(2050), 5);
});

test('calculateProjectProgress computes correct completion percentage', () => {
  assert.equal(calculateProjectProgress(3, 4), 75);
  assert.equal(calculateProjectProgress(0, 0), 0);
  assert.equal(calculateProjectProgress(5, 5), 100);
});
