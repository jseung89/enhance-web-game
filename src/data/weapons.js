const rouletteTable = [
  [35,45,18,2],[34,45,18,3],[33,44,20,3],[32,44,20,4],[30,44,21,5],
  [28,44,23,5],[27,43,24,6],[26,42,25,7],[24,42,27,7],[23,41,28,8],
  [20,40,31,9],[19,39,32,10],[18,38,33,11],[17,37,34,12],[16,36,35,13],
  [14,34,38,14],[13,33,39,15],[12,32,40,16],[10,30,42,18],[8,28,44,20],[5,25,45,25]
];

const rows = [
  ['나무젓가락','weapon_00_wooden_chopsticks_attack.png','poke','한 점 집기','이걸 들고 던전에 온 용기가 더 강하다.'],
  ['숟가락','weapon_01_spoon_attack.png','bash','은수저 강타','파괴력보다 자존심이 문제다.'],
  ['국자','weapon_02_ladle_attack.png','bash','국물 폭격','사거리는 생겼다. 위엄은 없다.'],
  ['슬리퍼','weapon_03_slipper_attack.png','bash','엄마의 응징','고블린이 맞고 잠깐 멈칫한다.'],
  ['후라이팬','weapon_04_frying_pan_attack.png','bash','팬 플래시','드디어 타격음이 생겼다.'],
  ['파리채','weapon_05_fly_swatter_attack.png','slash','찰싹 심판','찰싹 소리가 던전에 울린다.'],
  ['전기모기채','weapon_06_electric_fly_swatter_attack.png','slash','바직 심판','갑자기 속성 공격이 붙었다.'],
  ['녹슨 단검','weapon_07_rusty_dagger_attack.png','poke','녹슨 찌르기','이제 무기라고 부를 수 있다.'],
  ['낡은 철검','weapon_08_old_iron_sword_attack.png','slash','철검 베기','기본기 있는 검이다. 낡았지만 검이다.'],
  ['가시 철퇴','weapon_09_spiked_mace_attack.png','bash','가시 분쇄','맞으면 설명이 필요 없다.'],
  ['룬 각인 장검','weapon_10_rune_engraved_longsword_attack.png','slash','룬 버스트','제단이 드디어 관심을 보인다.'],
  ['불꽃 대검','weapon_11_flaming_greatsword_attack.png','slash','화염 절단','고블린들이 줄을 다시 선다.'],
  ['서리 창','weapon_12_frost_spear_attack.png','poke','빙결 관통','던전 공기가 차가워진다.'],
  ['번개 도끼','weapon_13_lightning_axe_attack.png','bash','낙뢰 참격','전기모기채의 정신을 계승했다.'],
  ['암흑 낫','weapon_14_dark_scythe_attack.png','slash','그림자 수확','이름부터 위험해졌다.'],
  ['누군가의 돌망치','weapon_15_someones_stone_hammer_attack.png','bash','거암 낙하','누군가의 것인데 아직 누군지는 모른다.'],
  ['용비늘 검','weapon_16_dragon_scale_sword_attack.png','slash','용린 파열','대장장이가 장갑을 꼈다.'],
  ['마력 대검','weapon_17_magic_greatsword_attack.png','slash','마력 폭주','검 주변이 조용해진다.'],
  ['고대 룬 블레이드','weapon_18_ancient_rune_blade_attack.png','slash','봉인 해제','제단이 진지해지기 시작한다.'],
  ['심연의 패왕검','weapon_19_abyss_overlord_sword_attack.png','slash','심연 파멸참','고블린이 웃음을 잃었다.'],
  ['앵그리빡빡의 광휘봉','weapon_20_angry_bald_radiant_club_attack.png','bash','빡광 폭발','머리가 무기다. 빛도 난다.']
];

export const weapons = rows.map((r, level) => {
  const [miss, light, heavy, special] = rouletteTable[level];
  return { level, name: r[0], file: r[1], attackType: r[2], specialName: r[3], description: r[4], roulette: { miss, light, heavy, special } };
});

export const getWeapon = (level) => weapons[Math.max(0, Math.min(20, level))];

export const weaponRenderConfig = {
  0: { cropLeft: 0, cropRight: 2, scale: 1.95, cardScale: 0.74, altarScale: 2.05, battleScale: 1.45, offsetX: 0, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  1: { cropLeft: 0, cropRight: 2, scale: 1.95, cardScale: 0.74, altarScale: 2.05, battleScale: 1.45, offsetX: 0, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  2: { cropLeft: 0, cropRight: 2, scale: 1.98, cardScale: 0.76, altarScale: 2.08, battleScale: 1.46, offsetX: -2, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  3: { cropLeft: 0, cropRight: 2, scale: 1.95, cardScale: 0.74, altarScale: 2.05, battleScale: 1.44, offsetX: 0, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  4: { cropLeft: 0, cropRight: 2, scale: 2.0, cardScale: 0.76, altarScale: 2.1, battleScale: 1.46, offsetX: -2, offsetY: 1, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  5: { cropLeft: 0, cropRight: 0, scale: 1.68, cardScale: 0.66, altarScale: 1.78, battleScale: 1.28, offsetX: -2, offsetY: 0, idleRotation: -10, pivotX: "14%", pivotY: "84%" },
  6: { cropLeft: 0, cropRight: 0, scale: 1.68, cardScale: 0.66, altarScale: 1.78, battleScale: 1.28, offsetX: -2, offsetY: 0, idleRotation: -10, pivotX: "14%", pivotY: "84%" },
  7: { cropLeft: 0, cropRight: 2, scale: 2.0, cardScale: 0.76, altarScale: 2.08, battleScale: 1.46, offsetX: 0, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  8: { cropLeft: 0, cropRight: 2, scale: 2.02, cardScale: 0.77, altarScale: 2.1, battleScale: 1.48, offsetX: -2, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  9: { cropLeft: 0, cropRight: 2, scale: 2.04, cardScale: 0.78, altarScale: 2.12, battleScale: 1.5, offsetX: -2, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  10: { cropLeft: 0, cropRight: 2, scale: 2.06, cardScale: 0.78, altarScale: 2.14, battleScale: 1.5, offsetX: -2, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  11: { cropLeft: 0, cropRight: 2, scale: 2.08, cardScale: 0.79, altarScale: 2.16, battleScale: 1.52, offsetX: -2, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  12: { cropLeft: 0, cropRight: 2, scale: 2.0, cardScale: 0.76, altarScale: 2.08, battleScale: 1.44, offsetX: -4, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  13: { cropLeft: 0, cropRight: 2, scale: 2.06, cardScale: 0.78, altarScale: 2.14, battleScale: 1.5, offsetX: -3, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  14: { cropLeft: 0, cropRight: 0, cropTop: 0, cropBottom: 0, scale: 1.58, cardScale: 0.62, altarScale: 1.72, battleScale: 1.22, offsetX: 0, offsetY: 0, idleRotation: -10, pivotX: "20%", pivotY: "78%" },
  15: { cropLeft: 0, cropRight: 2, scale: 2.08, cardScale: 0.79, altarScale: 2.16, battleScale: 1.52, offsetX: -2, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  16: { cropLeft: 0, cropRight: 2, scale: 2.1, cardScale: 0.8, altarScale: 2.18, battleScale: 1.54, offsetX: -3, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  17: { cropLeft: 0, cropRight: 2, scale: 2.1, cardScale: 0.8, altarScale: 2.18, battleScale: 1.54, offsetX: -3, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  18: { cropLeft: 0, cropRight: 2, scale: 2.12, cardScale: 0.8, altarScale: 2.2, battleScale: 1.56, offsetX: -4, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  19: { cropLeft: 0, cropRight: 2, scale: 2.14, cardScale: 0.82, altarScale: 2.22, battleScale: 1.58, offsetX: -4, offsetY: 0, idleRotation: -8, pivotX: "18%", pivotY: "82%" },
  // Rebuilt with the common 6-frame 2172×724 canvas. Keep generous padding
  // so the radiant club's sunburst never clips in card, altar, or battle views.
  20: { cropLeft: 0, cropRight: 0, scale: 2.05, cardScale: 0.76, altarScale: 2.1, battleScale: 1.5, offsetX: 0, offsetY: 0, idleRotation: -6, pivotX: "50%", pivotY: "76%" }
};
export const getWeaponRenderConfig = (level) => weaponRenderConfig[Math.max(0, Math.min(20, level))] || weaponRenderConfig[0];
