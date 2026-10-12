import { createRng, createSeed } from './random.js';
import { getSuccessRate } from './enhanceLogic.js';
import { pickResultByWeight, getDamageByResult } from './rouletteLogic.js';

export const RUN_REWARDS = [
  { id: 'supplies', name: '정비 보급', description: '체력 6 회복 · 강화석 2개', },
  { id: 'edge', name: '날 세우기', description: '모든 적중 피해 +1 · 강화석 1개', },
  { id: 'curse', name: '금지된 거래', description: '강화 +2 · 강화석 4개 · 최대 체력 −2 (최소 6)', },
];

export function enemyMaxHp(stage) { return 5 + stage + (stage % 3 === 0 ? 3 : 0); }

export function startRun(seed = createSeed()) {
  return { version: 1, seed, rngState: seed, stage: 1, phase: 'prepare', level: 0,
    hp: 18, maxHp: 18, enemyHp: enemyMaxHp(1), stones: 5, upgrades: 0,
    damageBonus: 0, turns: 0, log: ['첫 원정. 전투마다 최대 네 번 강화할 수 있습니다.'], events: [] };
}

function record(run, action, text, data = {}) {
  return { ...run, log: [text, ...run.log].slice(0, 16),
    events: [...run.events, { action, stage: run.stage, ...data }].slice(-500) };
}

export function upgradeRun(run) {
  if (run.phase !== 'prepare' || run.stones < 1 || run.upgrades >= 4 || run.level >= 20) return run;
  const rng = createRng(run.rngState), roll = rng() * 100;
  const success = roll < getSuccessRate(run.level), level = Math.min(20, run.level + (success ? 1 : 0));
  return record({ ...run, rngState: rng.getState(), stones: run.stones - 1, upgrades: run.upgrades + 1, level },
    'enhance', success ? `강화 성공! +${level}` : '강화 실패. 단계는 유지됩니다.', { roll, success });
}

export function enterRunBattle(run) {
  if (run.phase !== 'prepare') return run;
  return record({ ...run, phase: 'battle' }, 'battle', `${run.stage % 3 === 0 ? '보스' : '전투'} ${run.stage}/9 시작`);
}

export function attackRun(run) {
  if (run.phase !== 'battle') return run;
  const rng = createRng(run.rngState);
  const result = pickResultByWeight({ miss: Math.max(8, 30-run.level), light: 42, heavy: 23+run.level/2, special: 5+run.level/2 }, rng);
  const damage = result === 'miss' ? 0 : getDamageByResult(result) + Math.floor(run.level / 4) + run.damageBonus;
  const enemyHp = Math.max(0, run.enemyHp - damage);
  let next = { ...run, enemyHp, turns: run.turns + 1 };
  if (enemyHp === 0) {
    next = { ...next, rngState: rng.getState(), phase: run.stage === 9 ? 'won' : 'reward' };
    return record(next, 'attack', `${damage} 피해! ${run.stage === 9 ? '최종 보스 격파! 원정 완료.' : '승리! 보상을 선택하세요.'}`, { result, damage });
  }
  const enemyResult = pickResultByWeight({ miss: 25, light: 55, heavy: 17, special: 3 }, rng);
  const incoming = getDamageByResult(enemyResult), hp = Math.max(0, run.hp - incoming);
  next = { ...next, hp, rngState: rng.getState(), phase: hp === 0 ? 'lost' : 'battle' };
  return record(next, 'attack', `내 공격 ${damage === 0 ? '빗나감' : damage+' 피해'} · 적 공격 ${incoming === 0 ? '빗나감' : incoming+' 피해'}${hp === 0 ? ' · 원정 종료' : ''}`,
    { result, damage, enemyResult, incoming });
}

export function chooseRunReward(run, rewardId) {
  if (run.phase !== 'reward' || !RUN_REWARDS.some(r => r.id === rewardId)) return run;
  let next = { ...run, stage: run.stage + 1, phase: 'prepare', upgrades: 0, stones: run.stones + 2,
    hp: Math.min(run.maxHp, run.hp + 3), enemyHp: enemyMaxHp(run.stage + 1) };
  if (rewardId === 'supplies') { next.hp = Math.min(next.maxHp, next.hp + 6); next.stones += 2; }
  if (rewardId === 'edge') { next.damageBonus++; next.stones++; }
  if (rewardId === 'curse') { next.level = Math.min(20, next.level + 2); next.stones += 4; next.maxHp = Math.max(6, next.maxHp - 2); next.hp = Math.min(next.hp, next.maxHp); }
  return record(next, 'reward', `${RUN_REWARDS.find(r => r.id === rewardId).name} 선택 · 전투 사이 체력 3 회복 / 강화석 2개`, { rewardId });
}
