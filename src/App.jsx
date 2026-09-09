import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import TabNav from './components/TabNav.jsx';
import EnhanceScreen from './components/EnhanceScreen.jsx';
import PVEScreen from './components/PVEScreen.jsx';
import PVPScreen from './components/PVPScreen.jsx';
import RankingPage from './components/RankingPage.jsx';
import Lobby from './components/Lobby.jsx';
import { clearSave, initialState, loadSave, saveGame } from './utils/storage.js';

export default function App() {
  const [state, setState] = useState(null);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadSave();
    setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && state) saveGame(state);
  }, [state, isHydrated]);

  function setTab(tab) { setState(s => ({...s, activeTab: tab})); }
  function reset() {
    if (confirm('진짜 처음부터 다시 할까요? 제단이 웃고 있습니다.')) {
      clearSave();
      setState({ ...initialState });
    }
  }

  function applyTestCheat() {
    setState((current) => ({
      ...current,
      gold: 9_999_999,
      stone: 9_999,
      protectScroll: 999,
      enhanceLevel: 20,
      currentFloor: 20,
      bestFloor: 20,
      activeTab: 'enhance',
      logs: ['⚡ 테스트 치트 적용: 재화 MAX · +20 광휘봉 지급', ...(current.logs || [])].slice(0, 10)
    }));
  }

  if (!isHydrated || !state) {
    return <div className="app-shell"><div className="panel loading-panel">제단 불러오는 중... 잠깐만요.</div></div>;
  }

  return (
    <div className="app-shell">
      <Header state={state} onReset={reset} onCheat={applyTestCheat}/>
      <TabNav active={state.activeTab} onChange={setTab}/>
      {state.activeTab === 'lobby' && <Lobby state={state} onNavigate={setTab}/>} 
      {state.activeTab === 'enhance' && <EnhanceScreen key={`enhance-${state.enhanceLevel}`} state={state} setState={setState}/>} 
      {state.activeTab === 'pve' && <PVEScreen key={`pve-${state.currentFloor}-${state.enhanceLevel}`} state={state} setState={setState}/>} 
      {state.activeTab === 'pvp' && <PVPScreen key={`pvp-${state.enhanceLevel}`} state={state} setState={setState}/>} 
      {state.activeTab === 'ranking' && <RankingPage state={state}/>} 
    </div>
  );
}
