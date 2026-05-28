import { enhanceMessages, pick } from '../data/messages.js';

export function getAttack(level) { return 10 + level * 4; }
export function getEnhanceCost(level) { return { goldCost: 300 + level * 120, stoneCost: 1 + Math.floor(level / 5) }; }
export function getSuccessRate(level) {
  if (level >= 20) return 0;
  if (level <= 5) return 95;
  if (level <= 10) return 80;
  if (level <= 15) return 60;
  return 35;
}
export function getDowngradeChance(level) {
  if (level <= 10) return 0;
  if (level <= 15) return 30;
  return 60;
}

export function enhance(state, useProtect) {
  const level = state.enhanceLevel;
  if (level >= 20) return { nextState: state, result: 'max', message: pick(enhanceMessages.max) };
  const { goldCost, stoneCost } = getEnhanceCost(level);
  if (state.gold < goldCost || state.stone < stoneCost) {
    return { nextState: state, result: 'noCost', message: pick(enhanceMessages.noCost) };
  }

  let next = { ...state, gold: state.gold - goldCost, stone: state.stone - stoneCost };
  let result = 'fail';
  let afterLevel = level;
  const success = Math.random() * 100 < getSuccessRate(level);
  if (success) {
    result = 'success';
    afterLevel = Math.min(20, level + 1);
  } else {
    const shouldDown = Math.random() * 100 < getDowngradeChance(level);
    if (shouldDown) {
      if (useProtect && next.protectScroll > 0) {
        result = 'protected';
        next.protectScroll -= 1;
      } else {
        result = 'downgrade';
        afterLevel = Math.max(0, level - 1);
      }
    }
  }
  next.enhanceLevel = afterLevel;
  const message = pick(enhanceMessages[result]);
  const log = `[강화] +${level} → +${afterLevel} / ${message}`;
  next.logs = [log, ...(next.logs || [])].slice(0, 20);
  return { nextState: next, result, message };
}
