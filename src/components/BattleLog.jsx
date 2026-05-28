import React from 'react';
export default function BattleLog({ title = '전투 기록', logs = [] }) {
  return <div className="battle-log panel"><div className="log-title">{title}</div>{logs.length ? logs.slice(0,8).map((l,i)=><div key={i} className="log-line">{l}</div>) : <div className="log-empty">아직 기록이 없습니다. 룰렛이 몸을 풉니다.</div>}</div>;
}
