import React from 'react';
import SpritePlayer from './SpritePlayer.jsx';
import { getWeapon, getWeaponRenderConfig } from '../data/weapons.js';
import { assetUrl } from '../utils/assetUrl.js';

export default function Lobby({ state, onNavigate }) {
  const weapon = getWeapon(state.enhanceLevel);
  const render = getWeaponRenderConfig(state.enhanceLevel);
  const nextFloor = Math.min(state.currentFloor, 20);

  return (
    <main className="lobby-page">
      <section className="lobby-hero panel">
        <div className="lobby-hero-copy">
          <p className="eyebrow">THE FORGE NEVER FORGETS</p>
          <h1>강화는 멈추는 순간<br /><em>패배한다.</em></h1>
          <p className="lobby-lead">한 번의 선택으로 무기를 키우고, 던전을 뚫고, 전설을 남기세요.</p>
          <div className="lobby-actions">
            <button className="lobby-main-action" onClick={() => onNavigate('enhance')}>
              <span>제단으로</span><b>강화 시작</b><small>다음 강화: +{state.enhanceLevel + 1}</small>
            </button>
            <button className="lobby-side-action" onClick={() => onNavigate('pve')}>
              <span>악마의 동굴</span><b>{nextFloor}층 도전</b><small>보상 확인하기 →</small>
            </button>
          </div>
        </div>
        <div className="lobby-weapon-showcase" aria-label={`현재 무기 ${weapon.name}`}>
          <div className="showcase-orbit orbit-one" />
          <div className="showcase-orbit orbit-two" />
          <div className="showcase-glow" />
          <span className="showcase-label">CURRENT RELIC</span>
          <SpritePlayer
            key={`lobby-${weapon.file}-${state.enhanceLevel}`}
            src={assetUrl(`assets/weapons/${weapon.file}`)}
            variant="altar"
            scale={render.altarScale ?? render.scale ?? 2.05}
            cropLeft={render.cropLeft}
            cropRight={render.cropRight}
            cropTop={render.cropTop}
            cropBottom={render.cropBottom}
            offsetX={render.offsetX}
            offsetY={render.offsetY}
            idleRotation={render.idleRotation}
          />
          <div className="showcase-weapon-name"><span>+{state.enhanceLevel}</span> {weapon.name}</div>
          <small>{weapon.specialName}</small>
        </div>
      </section>

      <section className="lobby-status-grid">
        <article className="lobby-status-card"><span>최고 강화</span><strong>+{state.enhanceLevel}</strong><small>{weapon.name}</small></article>
        <article className="lobby-status-card"><span>탐험 기록</span><strong>{state.bestFloor}<i>층</i></strong><small>악마의 동굴 최고 기록</small></article>
        <article className="lobby-status-card"><span>보유 강화석</span><strong>💎 {state.stone}</strong><small>다음 강화에 사용할 수 있어요</small></article>
        <article className="lobby-status-card accent"><span>오늘의 목표</span><strong>+{state.enhanceLevel + 1}</strong><small>한 단계 더, 멈추지 말기</small></article>
      </section>

      <section className="lobby-briefing panel">
        <div><p className="eyebrow">NEXT DECISION</p><h2>지금 할 일</h2></div>
        <p>강화에 성공하면 공격력이 올라가고, 더 깊은 던전에서 더 많은 골드와 강화석을 얻을 수 있습니다.</p>
        <button className="ghost-btn" onClick={() => onNavigate('ranking')}>전설의 기록 보기</button>
      </section>
    </main>
  );
}
