import { mockHallOfFame, mockMyRanking, mockRankingLogs, mockRankings } from '../data/mockRankings.js';
import { getWeapon, weapons } from '../data/weapons.js';
import { assetUrl } from '../utils/assetUrl.js';

export const RANKING_KEYS = {
  rankings: 'enhanceGameRankings_v1',
  logs: 'enhanceGameRankingLogs_v1',
  currentUser: 'enhanceGameCurrentMockUser_v1'
};

function safeReadJson(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clampWeaponLevel(level) {
  return Math.max(0, Math.min(20, toNumber(level, 0)));
}

export function makeWeaponAsset(level, enhancement = level) {
  const safeLevel = clampWeaponLevel(level);
  const weapon = getWeapon(safeLevel);
  return {
    weaponId: `weapon_${String(weapon.level).padStart(2, '0')}`,
    id: weapon.level,
    level: weapon.level,
    name: weapon.name,
    displayName: weapon.name,
    enhancement: toNumber(enhancement, weapon.level),
    imageUrl: assetUrl(`assets/weapons/${weapon.file}`),
    spriteUrl: assetUrl(`assets/weapons/${weapon.file}`),
    attackType: weapon.attackType,
    specialName: weapon.specialName
  };
}

function normalizeWeaponId(id) {
  if (id === null || id === undefined) return null;
  const text = String(id);
  const match = text.match(/(\d+)/);
  if (!match) return text;
  const level = clampWeaponLevel(Number(match[1]));
  return `weapon_${String(level).padStart(2, '0')}`;
}

function hasMeaningfulRanking(raw) {
  if (!raw || typeof raw !== 'object') return false;
  const possibleName = raw.displayName || raw.nickname || raw.name || raw.userName || raw.playerName;
  const possibleWeapon = raw.representativeWeapon || raw.weapon || raw.currentWeapon || raw.bestWeapon || raw.equippedWeapon || raw.weaponName || raw.currentWeaponName || raw.bestWeaponName;
  const possibleStats = raw.highestFloor ?? raw.floor ?? raw.maxFloor ?? raw.currentFloor ?? raw.bestFloor ?? raw.highestEnhancement ?? raw.enhancement ?? raw.maxEnhancement ?? raw.weaponEnhancement ?? raw.bestEnhancement ?? raw.monsterKills ?? raw.kills ?? raw.killCount ?? raw.totalKills;
  return Boolean(possibleName || possibleWeapon || toNumber(possibleStats, 0) > 0);
}

export function normalizeRepresentativeWeapon(raw = {}, context = {}) {
  const weapon = raw.representativeWeapon || raw.weapon || raw.currentWeapon || raw.bestWeapon || raw.equippedWeapon || {};
  const enhancement = toNumber(
    (typeof weapon === 'object' ? weapon.enhancement : undefined) ??
    raw.highestEnhancement ??
    raw.enhancement ??
    raw.maxEnhancement ??
    raw.weaponEnhancement ??
    raw.bestEnhancement ??
    context.highestEnhancement ??
    0,
    0
  );

  if (typeof weapon === 'string') {
    return {
      weaponId: normalizeWeaponId(raw.weaponId || raw.currentWeaponId || raw.bestWeaponId),
      name: weapon || raw.weaponName || raw.currentWeaponName || raw.bestWeaponName || '기본 무기',
      displayName: weapon || raw.weaponName || raw.currentWeaponName || raw.bestWeaponName || '기본 무기',
      enhancement,
      spriteUrl: null,
      imageUrl: null
    };
  }

  return {
    weaponId: normalizeWeaponId(
      weapon.weaponId ||
      weapon.id ||
      raw.weaponId ||
      raw.currentWeaponId ||
      raw.bestWeaponId ||
      raw.level
    ),
    level: toNumber(weapon.level ?? raw.weaponLevel ?? raw.enhanceLevel ?? raw.highestEnhancement ?? enhancement, enhancement),
    name:
      weapon.name ||
      raw.weaponName ||
      raw.currentWeaponName ||
      raw.bestWeaponName ||
      raw.representativeWeaponName ||
      '기본 무기',
    displayName:
      weapon.displayName ||
      weapon.name ||
      raw.weaponName ||
      raw.currentWeaponName ||
      raw.bestWeaponName ||
      raw.representativeWeaponName ||
      '기본 무기',
    enhancement,
    spriteUrl: weapon.spriteUrl || weapon.imageUrl || weapon.assetUrl || weapon.src || weapon.asset || weapon.sprite || null,
    imageUrl: weapon.imageUrl || weapon.spriteUrl || weapon.assetUrl || weapon.src || weapon.asset || weapon.sprite || null,
    icon: weapon.icon || raw.icon || null
  };
}

export function resolveRankingWeapon(representativeWeapon, weaponList = weapons, fallbackWeapon = null) {
  const weapon = representativeWeapon || {};
  const explicitSrc = weapon.spriteUrl || weapon.imageUrl;
  const fallback = fallbackWeapon || makeWeaponAsset(clampWeaponLevel(weapon.level ?? weapon.enhancement ?? 0), weapon.enhancement ?? 0);

  if (explicitSrc && weapon.name && weapon.name !== '무기 없음') {
    return {
      ...weapon,
      displayName: weapon.displayName || weapon.name || '기본 무기',
      name: weapon.name || '기본 무기',
      spriteUrl: weapon.spriteUrl || weapon.imageUrl,
      imageUrl: weapon.imageUrl || weapon.spriteUrl,
      enhancement: toNumber(weapon.enhancement, 0),
      isFallback: false
    };
  }

  const id = normalizeWeaponId(weapon.weaponId || weapon.id);
  const name = weapon.name || weapon.displayName;
  const level = toNumber(weapon.level ?? weapon.enhancement, NaN);

  const found =
    weaponList.find((w) => id && `weapon_${String(w.level).padStart(2, '0')}` === id) ||
    weaponList.find((w) => Number.isFinite(level) && w.level === clampWeaponLevel(level)) ||
    weaponList.find((w) => name && w.name === name) ||
    weaponList.find((w) => name && w.name && name.includes(w.name)) ||
    weaponList.find((w) => name && w.name && w.name.includes(name));

  const resolved = found ? makeWeaponAsset(found.level, weapon.enhancement ?? found.level) : fallback;

  return {
    ...weapon,
    ...resolved,
    enhancement: toNumber(weapon.enhancement ?? resolved.enhancement, resolved.enhancement),
    isFallback: !found
  };
}

export function normalizeRankingRecord(raw, index = 0, options = {}) {
  const safeRaw = raw || {};
  const displayName =
    safeRaw.displayName ||
    safeRaw.nickname ||
    safeRaw.name ||
    safeRaw.userName ||
    safeRaw.playerName ||
    `테스터${index + 1}`;

  const highestFloor = toNumber(
    safeRaw.highestFloor ??
    safeRaw.floor ??
    safeRaw.maxFloor ??
    safeRaw.currentFloor ??
    safeRaw.bestFloor ??
    0,
    0
  );

  const highestEnhancement = toNumber(
    safeRaw.highestEnhancement ??
    safeRaw.enhancement ??
    safeRaw.maxEnhancement ??
    safeRaw.weaponEnhancement ??
    safeRaw.bestEnhancement ??
    safeRaw.enhanceLevel ??
    0,
    0
  );

  const monsterKills = toNumber(
    safeRaw.monsterKills ??
    safeRaw.kills ??
    safeRaw.killCount ??
    safeRaw.totalKills ??
    safeRaw.defeatedMonsters ??
    0,
    0
  );

  const normalizedWeapon = normalizeRepresentativeWeapon(safeRaw, { highestEnhancement });
  const representativeWeapon = resolveRankingWeapon(
    normalizedWeapon,
    weapons,
    options.fallbackWeapon || makeWeaponAsset(clampWeaponLevel(highestEnhancement), highestEnhancement)
  );

  return {
    userId:
      safeRaw.userId ||
      safeRaw.id ||
      safeRaw.discordUserId ||
      `local_user_${index}`,
    displayName,
    avatarText: safeRaw.avatarText || displayName.slice(0, 1) || '강',
    rank: toNumber(safeRaw.rank ?? index + 1, index + 1),
    highestFloor,
    highestEnhancement,
    monsterKills,
    totalBattles: toNumber(safeRaw.totalBattles ?? safeRaw.battles ?? 0, 0),
    title: safeRaw.title || safeRaw.nicknameTitle || safeRaw.badgeTitle || '강화 입문자',
    guildName: safeRaw.guildName || '우리들의 강화단',
    representativeWeapon,
    updatedAt: safeRaw.updatedAt || safeRaw.createdAt || new Date().toISOString()
  };
}

function getOverallScore(record) {
  return (record.highestFloor || 0) * 100 + (record.highestEnhancement || 0) * 50 + (record.monsterKills || 0) * 2;
}

function sortRankings(rankings, type = 'overall') {
  const sorted = [...rankings];
  const comparators = {
    overall: (a, b) => getOverallScore(b) - getOverallScore(a),
    floor: (a, b) => (b.highestFloor || 0) - (a.highestFloor || 0) || (b.highestEnhancement || 0) - (a.highestEnhancement || 0),
    enhance: (a, b) => (b.highestEnhancement || 0) - (a.highestEnhancement || 0) || (b.highestFloor || 0) - (a.highestFloor || 0),
    kills: (a, b) => (b.monsterKills || 0) - (a.monsterKills || 0) || (b.highestFloor || 0) - (a.highestFloor || 0),
    hall: (a, b) => getOverallScore(b) - getOverallScore(a)
  };
  sorted.sort(comparators[type] || comparators.overall);
  return sorted.map((record, index) => ({ ...record, rank: index + 1, overallScore: getOverallScore(record) }));
}

function mergeCurrentStateRanking(rankings, currentState) {
  if (!currentState) return rankings;
  const level = clampWeaponLevel(currentState.enhanceLevel ?? 0);
  const currentRecord = normalizeRankingRecord(
    {
      userId: 'local_current_player',
      displayName: '승이형',
      avatarText: '강',
      guildName: '우리들의 강화단',
      bestFloor: currentState.bestFloor ?? currentState.currentFloor ?? 1,
      highestFloor: currentState.bestFloor ?? currentState.currentFloor ?? 1,
      highestEnhancement: level,
      enhancement: level,
      monsterKills: currentState.monsterKills ?? currentState.kills ?? currentState.totalKills ?? 46,
      representativeWeapon: makeWeaponAsset(level, level),
      title: level >= 10 ? '강화 중독자' : '강화 입문자'
    },
    0,
    { fallbackWeapon: makeWeaponAsset(level, level) }
  );

  const withoutCurrent = rankings.filter((item) => item.userId !== currentRecord.userId && item.displayName !== currentRecord.displayName);
  return [currentRecord, ...withoutCurrent];
}

export function getRankings({ type = 'overall', currentState = null } = {}) {
  const stored = safeReadJson(RANKING_KEYS.rankings, null);
  const normalizedStored = Array.isArray(stored)
    ? stored.filter(hasMeaningfulRanking).map((item, index) => normalizeRankingRecord(item, index))
    : [];
  const source = normalizedStored.length > 0
    ? normalizedStored
    : mockRankings.map((item, index) => normalizeRankingRecord(item, index));
  return sortRankings(mergeCurrentStateRanking(source, currentState), type);
}

export function getMyRanking(currentState = null) {
  const currentUser = safeReadJson(RANKING_KEYS.currentUser, null);

  if (currentState) {
    const level = clampWeaponLevel(currentState.enhanceLevel ?? 0);
    const currentWeapon = makeWeaponAsset(level, level);
    const highestFloor = toNumber(currentState.bestFloor ?? currentState.currentFloor ?? mockMyRanking.highestFloor, mockMyRanking.highestFloor);
    const highestEnhancement = Math.max(level, toNumber(mockMyRanking.highestEnhancement, 0));
    return {
      ...mockMyRanking,
      ...(currentUser || {}),
      userId: currentUser?.userId || 'local_current_player',
      displayName: currentUser?.displayName || '승이형',
      avatarText: currentUser?.avatarText || '강',
      representativeWeapon: currentWeapon,
      highestFloor,
      highestEnhancement,
      monsterKills: toNumber(currentState.monsterKills ?? currentState.kills ?? currentState.totalKills ?? 46, 46),
      overallRank: 1,
      nextGoalMessage: highestFloor >= 20 ? '이제 TOP 1을 노려볼 차례' : '20층 돌파 시 상위권 가능'
    };
  }

  if (!currentUser) return normalizeRankingRecord(mockMyRanking, 0);

  const rankings = getRankings({ type: 'overall' });
  const matched = rankings.find((item) => item.userId === currentUser.userId || item.displayName === currentUser.displayName);
  if (!matched) return { ...normalizeRankingRecord(mockMyRanking, 0), ...currentUser };

  return {
    userId: matched.userId,
    displayName: matched.displayName,
    avatarText: matched.avatarText || matched.displayName?.slice(0, 1) || '강',
    representativeWeapon: matched.representativeWeapon || normalizeRankingRecord(mockMyRanking, 0).representativeWeapon,
    guildName: currentUser.guildName || matched.guildName || mockMyRanking.guildName,
    overallRank: matched.rank,
    highestFloor: matched.highestFloor,
    highestEnhancement: matched.highestEnhancement,
    monsterKills: matched.monsterKills,
    nextGoalMessage: matched.highestFloor >= 20 ? '이제 TOP 1을 노려볼 차례' : '20층 돌파 시 상위권 가능'
  };
}

function getRankingLogMessage(log, displayName = '플레이어') {
  if (log.message) return log.message;
  if (log.type === 'enhancement_success') {
    const enhance = log.enhancement ? `+${log.enhancement} ` : '';
    const weapon = log.weaponName || log.weapon?.name || '무기';
    return `${displayName}님이 ${enhance}${weapon} 강화에 성공했습니다.`;
  }
  if (log.type === 'enhancement_fail') return `${displayName}님이 강화 실패로 무기가 누워버렸습니다.`;
  if (log.type === 'highest_floor') {
    const floor = log.floor || log.highestFloor;
    return `${displayName}님이 ${floor ? `${floor}층을` : '최고층을'} 돌파했습니다.`;
  }
  if (log.type === 'top3_entry') return `${displayName}님이 TOP 3에 진입했습니다.`;
  if (log.type === 'rank_up') return `${displayName}님의 랭킹이 상승했습니다.`;
  return '새로운 랭킹 기록이 등록되었습니다.';
}

export function normalizeRankingLog(raw, index = 0) {
  const log = raw || {};
  const displayName = log.displayName || log.nickname || log.name || '플레이어';
  const weapon = log.weapon ? resolveRankingWeapon(normalizeRepresentativeWeapon({ representativeWeapon: log.weapon }), weapons) : null;
  return {
    id: log.id || `local_log_${index}`,
    type: log.type || 'ranking_update',
    displayName,
    icon: log.icon || '✨',
    weapon,
    weaponName: log.weaponName || log.weapon?.name || weapon?.name || null,
    enhancement: log.enhancement ?? log.weapon?.enhancement ?? weapon?.enhancement ?? null,
    floor: log.floor ?? log.highestFloor ?? null,
    message: getRankingLogMessage({ ...log, weapon, weaponName: log.weaponName || weapon?.name }, displayName),
    createdAtLabel: log.createdAtLabel || log.timeLabel || '방금 전',
    createdAt: log.createdAt || new Date().toISOString()
  };
}

export function getRankingLogs({ currentState = null } = {}) {
  const stored = safeReadJson(RANKING_KEYS.logs, null);
  const normalizedStored = Array.isArray(stored)
    ? stored.map((item, index) => normalizeRankingLog(item, index)).filter((log) => log.message)
    : [];

  if (normalizedStored.length > 0) return normalizedStored;

  const logs = mockRankingLogs.map((item, index) => normalizeRankingLog(item, index));
  if (currentState) {
    const level = clampWeaponLevel(currentState.enhanceLevel ?? 0);
    const currentWeapon = makeWeaponAsset(level, level);
    return [
      normalizeRankingLog({
        id: 'local_current_log',
        type: 'enhancement_success',
        displayName: '승이형',
        weapon: currentWeapon,
        weaponName: currentWeapon.name,
        enhancement: level,
        message: `승이형님이 +${level} ${currentWeapon.name} 기록으로 랭킹에 등록되었습니다.`,
        createdAtLabel: '방금 전'
      }, 0),
      ...logs.slice(0, 4)
    ];
  }
  return logs;
}

export function getHallOfFame() {
  return {
    ...mockHallOfFame,
    winningWeapon: resolveRankingWeapon(mockHallOfFame.winningWeapon, weapons)
  };
}
