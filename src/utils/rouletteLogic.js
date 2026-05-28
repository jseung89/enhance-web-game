import { RESULT_META, resultOrder } from '../data/roulette.js';

export function normalizeWeights(weights) {
  const total = resultOrder.reduce((sum, key) => sum + Number(weights?.[key] || 0), 0) || 100;
  return Object.fromEntries(resultOrder.map((key) => [key, (Number(weights?.[key] || 0) / total) * 100]));
}

export function buildRouletteSegments(weights) {
  const normalized = normalizeWeights(weights);
  let cursorPercent = 0;
  let cursorDeg = 0;
  return resultOrder.map((key) => {
    const percent = normalized[key] || 0;
    const degrees = (percent / 100) * 360;
    const segment = {
      key,
      result: key,
      percent,
      startPercent: cursorPercent,
      endPercent: cursorPercent + percent,
      startDeg: cursorDeg,
      endDeg: cursorDeg + degrees,
      centerDeg: cursorDeg + degrees / 2
    };
    cursorPercent += percent;
    cursorDeg += degrees;
    return segment;
  });
}

export function pickResultByWeight(weights) {
  const normalized = normalizeWeights(weights);
  let roll = Math.random() * 100;
  for (const key of resultOrder) {
    roll -= normalized[key] || 0;
    if (roll <= 0) return key;
  }
  return resultOrder[resultOrder.length - 1] || 'miss';
}

// Backward-compatible alias.
export const weightedPick = pickResultByWeight;

export function pickTargetAngleForResult(result, segments, margin = 7) {
  const seg = segments.find((x) => x.result === result || x.key === result) || segments[0];
  if (!seg) return 0;
  const span = Math.max(0, seg.endDeg - seg.startDeg);
  if (span <= margin * 2 + 2) return seg.centerDeg;
  const min = seg.startDeg + margin;
  const max = seg.endDeg - margin;
  return min + Math.random() * (max - min);
}

export function segmentCenterDegrees(weights, result) {
  const segments = buildRouletteSegments(weights);
  return (segments.find((x) => x.result === result)?.centerDeg) ?? 0;
}

export function getWheelRotationForTargetAngle(currentRotation, targetAngle, extraSpins = 4) {
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const desiredMod = ((360 - targetAngle) % 360 + 360) % 360;
  let delta = desiredMod - currentMod;
  if (delta < 0) delta += 360;
  return currentRotation + extraSpins * 360 + delta;
}

export function getDamageByResult(result) {
  return RESULT_META[result]?.damage ?? 0;
}

export function getEffectByResult(result) {
  if (result === 'miss') return null;
  return RESULT_META[result]?.effect || null;
}

export function getMessageByResult(actor, result) {
  const label = RESULT_META[result]?.label || '실패';
  const prefix = result === 'miss' ? '실패!' : `${label}!`;
  return `${prefix} ${actor}의 판정이 ${label}(으)로 확정됐습니다.`;
}

export function createTurnResult(actor, rouletteTable, overrideResult = null) {
  const segments = buildRouletteSegments(rouletteTable);
  const result = overrideResult || pickResultByWeight(rouletteTable);
  const targetAngle = pickTargetAngleForResult(result, segments, 7);
  return {
    id: `${actor}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actor,
    result,
    targetAngle,
    damage: getDamageByResult(result),
    effect: getEffectByResult(result),
    shouldAttack: result !== 'miss',
    shouldShowMissFx: result === 'miss',
    segments
  };
}
