import React from 'react';

export default function Header({ state, onReset }) {
  return (
    <header className="topbar">
      <div className="brand"><span className="cat">◥(ฅº￦ºฅ)◤</span><strong>강화는 못 참지</strong><span>☠</span></div>
      <div className="resources">
        <span>🪙 {state.gold.toLocaleString()}</span>
        <span>💎 {state.stone.toLocaleString()}</span>
        <span>📜 {state.protectScroll}</span>
        <span>🏆 {state.pvpWins}승</span>
      </div>
      <button className="ghost-btn" onClick={onReset}>처음부터 다시 하기</button>
    </header>
  );
}
