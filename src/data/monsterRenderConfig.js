export const monsterRenderConfig = {
  '꼰적이 슬라임 대장': {
    scale: 0.72,
    offsetX: 0,
    offsetY: -30,
    shadowScaleX: 0.9,
    shadowScaleY: 0.82,
    shadowOffsetX: 0,
    shadowOffsetY: -8,
    quoteOffsetY: -16
  },
  '삐죽이 고블린': {
    scale: 0.82,
    offsetX: 0,
    offsetY: -20,
    shadowScaleX: 0.78,
    shadowScaleY: 0.76,
    shadowOffsetX: 0,
    shadowOffsetY: -4,
    quoteOffsetY: -12
  },
  '눈치보는 박쥐': {
    scale: 0.74,
    offsetX: 0,
    offsetY: -28,
    shadowScaleX: 0.74,
    shadowScaleY: 0.7,
    shadowOffsetX: 0,
    shadowOffsetY: -8,
    quoteOffsetY: -18
  },
  '던전 먼지정령': {
    scale: 0.68,
    offsetX: 0,
    offsetY: -34,
    shadowScaleX: 0.78,
    shadowScaleY: 0.74,
    shadowOffsetX: 0,
    shadowOffsetY: -7,
    quoteOffsetY: -18
  },
  '비명 지르는 버섯': {
    scale: 0.72,
    offsetX: 0,
    offsetY: -28,
    shadowScaleX: 0.78,
    shadowScaleY: 0.74,
    shadowOffsetX: 0,
    shadowOffsetY: -6,
    quoteOffsetY: -16
  },
  '룬 씹은 멧돼지': {
    scale: 0.66,
    offsetX: -8,
    offsetY: -26,
    shadowScaleX: 0.92,
    shadowScaleY: 0.78,
    shadowOffsetX: 2,
    shadowOffsetY: -6,
    quoteOffsetY: -14
  },
  '수상한 항아리괴물': {
    scale: 0.68,
    offsetX: 0,
    offsetY: -32,
    shadowScaleX: 0.82,
    shadowScaleY: 0.78,
    shadowOffsetX: 0,
    shadowOffsetY: -7,
    quoteOffsetY: -18
  },
  '밤샘 해골병': {
    scale: 0.76,
    offsetX: 0,
    offsetY: -22,
    shadowScaleX: 0.72,
    shadowScaleY: 0.7,
    shadowOffsetX: 0,
    shadowOffsetY: -4,
    quoteOffsetY: -12
  },
  '외눈 말랑괴수': {
    scale: 0.68,
    offsetX: 0,
    offsetY: -32,
    shadowScaleX: 0.84,
    shadowScaleY: 0.8,
    shadowOffsetX: 0,
    shadowOffsetY: -8,
    quoteOffsetY: -18
  },
  '삐딱한 미믹': {
    scale: 0.72,
    offsetX: 0,
    offsetY: -26,
    shadowScaleX: 0.86,
    shadowScaleY: 0.76,
    shadowOffsetX: 0,
    shadowOffsetY: -6,
    quoteOffsetY: -14
  }
};

export function getMonsterRenderConfig(name) {
  return monsterRenderConfig[name] || {
    scale: 0.74,
    offsetX: 0,
    offsetY: -24,
    shadowScaleX: 0.84,
    shadowScaleY: 0.78,
    shadowOffsetX: 0,
    shadowOffsetY: -6,
    quoteOffsetY: -14
  };
}
