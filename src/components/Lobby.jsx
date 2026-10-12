import React from 'react';
import SpritePlayer from './SpritePlayer.jsx';
import ForgeRoom from './ForgeRoom.jsx';
import './forge.css';
import { getWeapon, getWeaponRenderConfig } from '../data/weapons.js';
import { assetUrl } from '../utils/assetUrl.js';

export default function Lobby({ state, onNavigate }) {
  const weapon = getWeapon(state.enhanceLevel);
  const render = getWeaponRenderConfig(state.enhanceLevel);
  const nextFloor = Math.min(state.currentFloor, 20);
  const continuing = state.expedition && !['won','lost'].includes(state.expedition.phase);

  return (
    <main className="lobby-page forge-lobby">
      <header className="forge-intro"><div><p>문 닫는 시간 없는 대장간</p><h1>오늘도, 한 번만 더.</h1></div><span>● 작업 중</span></header>
      <section className="lobby-hero panel">
        <ForgeRoom/>
        <div className="lobby-hero-copy">
          <p className="eyebrow">아홉 개의 문</p>
          <h1>{continuing ? `${state.expedition.stage}번째 문이` : '불빛 너머로'}<br /><em>{continuing ? '기다리고 있어요.' : '떠날 시간.'}</em></h1>
          <p className="lobby-lead">강화하고, 싸우고, 전리품을 챙기세요.<br/>세 번째 문마다 보스가 기다립니다.</p>
          <div className="lobby-actions">
            <button className="lobby-main-action" onClick={() => onNavigate('run')}>
              <span>원정 전용 장비 · 기존 재화 유지</span><b>{continuing ? '원정 이어가기 →' : '원정 준비하기 →'}</b><small>전투 9회 · 선택은 당신의 몫</small>
            </button>
            <button className="lobby-side-action" onClick={() => onNavigate('pve')}>
              <span>악마의 동굴</span><b>{nextFloor}층 도전</b><small>보상 확인하기 →</small>
            </button>
          </div>
        </div>
        <div className="lobby-weapon-showcase" aria-label={`현재 무기 ${weapon.name}`}>
          <div className="showcase-glow" />
          <span className="showcase-label">작업대 위의 무기</span>
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

      <nav className="forge-workbench" aria-label="대장간 활동">
        <button onClick={()=>onNavigate('enhance')}><span aria-hidden="true">⚒</span><div><small>무기 손질</small><strong>강화 작업대</strong><small>{state.enhanceLevel>=20?'최고 단계 달성':`현재 +${state.enhanceLevel} → 다음 +${state.enhanceLevel+1}`}</small></div><b aria-hidden="true">↗</b></button>
        <button onClick={()=>onNavigate('pve')}><span aria-hidden="true">⚑</span><div><small>익숙한 모험</small><strong>악마의 동굴</strong><small>{nextFloor}층 도전 · 최고 {state.bestFloor}층</small></div><b aria-hidden="true">↗</b></button>
        <button onClick={()=>onNavigate('ranking')}><span aria-hidden="true">▤</span><div><small>남겨 둔 발자국</small><strong>기록 펼치기</strong><small>장비와 탐험 기록 확인</small></div><b aria-hidden="true">↗</b></button>
      </nav>
      <p className="forge-footnote">무기는 그대로, 모험은 새롭게. 기존 장비와 골드는 원정에 소모되지 않습니다.</p>
    </main>
  );
}
