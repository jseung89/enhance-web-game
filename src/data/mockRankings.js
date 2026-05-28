import { getWeapon } from './weapons.js';

function makeRankingWeapon(level, enhancement = level) {
  const weapon = getWeapon(level);
  return {
    weaponId: `weapon_${String(weapon.level).padStart(2, '0')}`,
    level: weapon.level,
    name: weapon.name,
    enhancement,
    imageUrl: `/assets/weapons/${weapon.file}`,
    spriteUrl: `/assets/weapons/${weapon.file}`,
    attackType: weapon.attackType,
    specialName: weapon.specialName
  };
}

export const rankingTabs = [
  { id: 'overall', label: '종합 랭킹' },
  { id: 'floor', label: '최고층' },
  { id: 'enhance', label: '최고 강화' },
  { id: 'kills', label: '처치 수' },
  { id: 'hall', label: '명예의 전당' }
];

export const mockRankings = [
  {
    userId: 'mock_seung', displayName: '승이형', avatarText: '승', rank: 1,
    representativeWeapon: makeRankingWeapon(12, 17),
    highestFloor: 72, highestEnhancement: 17, monsterKills: 381, totalBattles: 520,
    title: '강화에 미친 자', updatedAt: '2026-05-28T12:00:00.000Z'
  },
  {
    userId: 'mock_gunjung', displayName: '건중', avatarText: '건', rank: 2,
    representativeWeapon: makeRankingWeapon(14, 15),
    highestFloor: 65, highestEnhancement: 15, monsterKills: 320, totalBattles: 448,
    title: '하체 봉인 드러머', updatedAt: '2026-05-28T11:20:00.000Z'
  },
  {
    userId: 'mock_jaehyuk', displayName: '재혁', avatarText: '재', rank: 3,
    representativeWeapon: makeRankingWeapon(10, 14),
    highestFloor: 58, highestEnhancement: 14, monsterKills: 290, totalBattles: 390,
    title: '귀에 꽂힌 성검', updatedAt: '2026-05-28T10:10:00.000Z'
  },
  { userId: 'mock_lookza', displayName: '룩자', avatarText: '룩', rank: 4, representativeWeapon: makeRankingWeapon(13, 13), highestFloor: 52, highestEnhancement: 13, monsterKills: 268, totalBattles: 330, title: '전기 파마 참지', updatedAt: '2026-05-28T09:10:00.000Z' },
  { userId: 'mock_mint', displayName: '초코맛민트', avatarText: '민', rank: 5, representativeWeapon: makeRankingWeapon(11, 13), highestFloor: 51, highestEnhancement: 13, monsterKills: 250, totalBattles: 311, title: '민트는 덤일 뿐', updatedAt: '2026-05-28T08:40:00.000Z' },
  { userId: 'mock_kking', displayName: '낑낑', avatarText: '낑', rank: 6, representativeWeapon: makeRankingWeapon(7, 12), highestFloor: 47, highestEnhancement: 12, monsterKills: 231, totalBattles: 300, title: '그림자 밟는 자', updatedAt: '2026-05-28T08:20:00.000Z' },
  { userId: 'mock_bear', displayName: '불곰', avatarText: '불', rank: 7, representativeWeapon: makeRankingWeapon(9, 12), highestFloor: 45, highestEnhancement: 12, monsterKills: 219, totalBattles: 286, title: '불타는 곰돌이', updatedAt: '2026-05-28T07:50:00.000Z' },
  { userId: 'mock_ddung', displayName: '뚱이형', avatarText: '뚱', rank: 8, representativeWeapon: makeRankingWeapon(4, 11), highestFloor: 43, highestEnhancement: 11, monsterKills: 198, totalBattles: 255, title: '후라이팬이 본체', updatedAt: '2026-05-28T07:00:00.000Z' },
  { userId: 'mock_kim', displayName: '김강화', avatarText: '김', rank: 9, representativeWeapon: makeRankingWeapon(6, 11), highestFloor: 41, highestEnhancement: 11, monsterKills: 184, totalBattles: 241, title: '바직바직 실패', updatedAt: '2026-05-28T06:50:00.000Z' },
  { userId: 'mock_solo', displayName: '나홀로강화', avatarText: '나', rank: 10, representativeWeapon: makeRankingWeapon(17, 11), highestFloor: 40, highestEnhancement: 11, monsterKills: 176, totalBattles: 230, title: '빛은 있으나...', updatedAt: '2026-05-28T06:10:00.000Z' }
];

export const mockMyRanking = {
  userId: 'mock_seung',
  displayName: '승이형',
  avatarText: '승',
  representativeWeapon: makeRankingWeapon(12, 12),
  guildName: '우리들의 강화단',
  overallRank: 3,
  highestFloor: 18,
  highestEnhancement: 12,
  monsterKills: 84,
  nextGoalMessage: '20층 돌파 시 2위 가능'
};

export const mockRankingLogs = [
  { id: 'log_001', type: 'enhancement_success', weapon: makeRankingWeapon(12, 15), displayName: '승이형', message: '승이형님이 +15 서리 창 강화에 성공했습니다.', createdAtLabel: '2분 전' },
  { id: 'log_002', type: 'highest_floor', icon: '🌀', displayName: '재혁', message: '재혁님이 악마의 동굴 42층을 돌파했습니다.', createdAtLabel: '12분 전' },
  { id: 'log_003', type: 'top3_entry', icon: '🏆', displayName: '룩자', message: '룩자님이 TOP 3에 진입했습니다.', createdAtLabel: '18분 전' },
  { id: 'log_004', type: 'enhancement_fail', weapon: makeRankingWeapon(14, 15), displayName: '건중', message: '건중님이 강화 실패로 무기가 누워버렸습니다.', createdAtLabel: '25분 전' },
  { id: 'log_005', type: 'rank_up', icon: '⬆️', displayName: '낑낑', message: '낑낑님이 15위에서 11위로 상승했습니다.', createdAtLabel: '35분 전' }
];

export const mockHallOfFame = {
  title: '전설의 강화자',
  subtitle: '시즌 1 최종 1위',
  displayName: '승이형',
  winningWeapon: makeRankingWeapon(12, 17),
  icon: '👑'
};
