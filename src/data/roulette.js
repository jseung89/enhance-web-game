export const RESULT_META = {
  miss: { label: '실패', damage: 0, className: 'miss', effect: 'fx_hit_miss.png' },
  light: { label: '약공격', damage: 1, className: 'light', effect: 'fx_hit_light.png' },
  heavy: { label: '강공격', damage: 2, className: 'heavy', effect: 'fx_hit_heavy.png' },
  special: { label: '필살기', damage: 3, className: 'special', effect: 'fx_hit_special.png' }
};

export const resultOrder = ['miss', 'light', 'heavy', 'special'];
