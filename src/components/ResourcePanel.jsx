import React from 'react';
export default function ResourcePanel({ state }) {
  return <div className="resource-panel panel"><b>현재 자원</b><div>🪙 금화 {state.gold.toLocaleString()}</div><div>💎 강화석 {state.stone}</div><div>📜 수호 주문서 {state.protectScroll}</div><div>🏰 최고층 {state.bestFloor}층</div></div>;
}
