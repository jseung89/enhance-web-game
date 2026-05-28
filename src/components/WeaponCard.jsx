import React from 'react';
import SpritePlayer from './SpritePlayer.jsx';
import { getAttack } from '../utils/enhanceLogic.js';

export default function WeaponCard({ weapon, level, animated = false, mirrored = false, scale = 0.78, className = '' }) {
  return (
    <div className={`weapon-card panel parchment ${className}`}>
      <div className="ribbon">현재 장비</div>
      <h2>+{level} {weapon.name}</h2>
      <div className="weapon-stage-card">
        <SpritePlayer src={`/assets/weapons/${weapon.file}`} playing={animated} loop={animated} mirrored={mirrored} scale={scale} variant="card" />
      </div>
      <div className="stat-row"><span>공격력</span><b>⚔ {getAttack(level).toLocaleString()}</b></div>
      <p className="desc">{weapon.description}</p>
      <div className="mini-probs">
        <span>☠ 실패 {weapon.roulette.miss}%</span><span>⚔ 약공 {weapon.roulette.light}%</span><span>💥 강공 {weapon.roulette.heavy}%</span><span>✦ 필살기 {weapon.roulette.special}%</span>
      </div>
    </div>
  );
}
