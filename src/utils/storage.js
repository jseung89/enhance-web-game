export const SAVE_KEY = 'enhance_cant_stop_save_v2';

export const initialState = {
  gold: 10000,
  stone: 50,
  protectScroll: 3,
  enhanceLevel: 0,
  currentFloor: 1,
  bestFloor: 1,
  pvpWins: 0,
  pvpLosses: 0,
  activeTab: 'lobby',
  logs: [],
  pveLogs: [],
  pvpLogs: []
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
