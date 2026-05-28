import { RESULT_META } from '../data/roulette.js';
import { battleLines, pick } from '../data/messages.js';

export function getDamageByResult(result) {
  return RESULT_META[result]?.damage ?? 0;
}

export function applyHit(hp, result) {
  return Math.max(0, hp - getDamageByResult(result));
}

export function getAnimationPlanByResult(result) {
  const meta = RESULT_META[result] || RESULT_META.miss;
  if (result === 'miss') {
    return {
      result: 'miss',
      type: 'miss',
      damage: 0,
      shouldMoveWeapon: false,
      shouldPlayWeaponSprite: false,
      hitEffect: null,
      cssClass: 'weapon-miss-wobble'
    };
  }
  return {
    result,
    type: 'attack',
    damage: meta.damage,
    shouldMoveWeapon: true,
    shouldPlayWeaponSprite: true,
    hitEffect: meta.effect,
    cssClass: `weapon-${result}-attack`
  };
}

export function resultMessage(actor, result) {
  const prefix = result === 'miss' ? '실패!' : result === 'light' ? '약공격!' : result === 'heavy' ? '강공격!' : '필살기!';
  return `${prefix} ${actor} ${pick(battleLines[result] || battleLines.miss)}`;
}
