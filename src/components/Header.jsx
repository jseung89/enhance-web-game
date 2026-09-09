import React from 'react';

export default function Header({ state, onReset, onCheat }) {
  return (
    <header className="topbar">
      <div className="brand"><span className="cat">◥(ฅº￦ºฅ)◤</span><strong>강화는 못 참지</strong><span>☠</span></div>
      <div className="resources">
        <span>🪙 {state.gold.toLocaleString()}</span>
        <span>💎 {state.stone.toLocaleString()}</span>
        <span>📜 {state.protectScroll}</span>
        <span>🏆 {state.pvpWins}승</span>
      </div>
      <div className="header-actions">
        <button className="cheat-btn" onClick={onCheat} title="테스트 전용: 재화와 강화 단계를 최대치로 설정합니다.">⚡ 테스트 치트</button>
        <button className="ghost-btn" onClick={onReset}>처음부터 다시 하기</button>
      </div>
    </header>
  );
}
