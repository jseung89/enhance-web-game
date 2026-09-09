import React from 'react';
const tabs = [ ['lobby','⌂ 로비'], ['enhance','🔨 강화'], ['pve','🗺️ PVE 모험'], ['pvp','⚔️ PVP 준비중 🔒'], ['ranking','👑 랭킹'] ];
export default function TabNav({ active, onChange }) {
  return <nav className="tabs">{tabs.map(([id,label]) => <button key={id} className={active===id?'on':''} onClick={() => onChange(id)}>{label}</button>)}</nav>;
}
