import { assetUrl } from '../utils/assetUrl.js';

export const monsterImageByName = {
  '수상한 항아리괴물': assetUrl('assets/monsters/monster_01_suspicious_jar_monster.png'),
  '삐죽이 고블린': assetUrl('assets/monsters/monster_02_spiky_goblin.png'),
  '눈치보는 박쥐': assetUrl('assets/monsters/monster_03_nervous_bat.png'),
  '밤샘 해골병': assetUrl('assets/monsters/monster_04_overtime_skeleton.png'),
  '던전 먼지정령': assetUrl('assets/monsters/monster_05_dungeon_dust_spirit.png'),
  '외눈 말랑괴수': assetUrl('assets/monsters/monster_06_one_eyed_soft_beast.png'),
  '비명 지르는 버섯': assetUrl('assets/monsters/monster_07_screaming_mushroom.png'),
  '삐딱한 미믹': assetUrl('assets/monsters/monster_08_crooked_mimic.png'),
  '꼰적이 슬라임 대장': assetUrl('assets/monsters/monster_09_slime_boss.png'),
  '룬 씹은 멧돼지': assetUrl('assets/monsters/monster_10_rune_boar.png')
};

export const monsterNames = [
  '꼰적이 슬라임 대장','삐죽이 고블린','눈치보는 박쥐','던전 먼지정령','비명 지르는 버섯',
  '룬 씹은 멧돼지','수상한 항아리괴물','밤샘 해골병','외눈 말랑괴수','삐딱한 미믹'
];

export function getMonster(floor = 1) {
  const name = monsterNames[(floor - 1) % monsterNames.length];
  const band = Math.min(3, Math.floor((floor - 1) / 5));
  const roulettes = [
    { miss: 25, light: 45, heavy: 25, special: 5 },
    { miss: 23, light: 42, heavy: 28, special: 7 },
    { miss: 20, light: 40, heavy: 30, special: 10 },
    { miss: 18, light: 37, heavy: 33, special: 12 }
  ];
  return {
    name,
    file: monsterImageByName[name],
    floor,
    hp: 3,
    roulette: roulettes[band],
    trait: floor >= 15 ? '고층 몬스터라 룰렛이 좀 건방집니다.' : '아직은 귀엽지만 방심하면 맞습니다.'
  };
}
