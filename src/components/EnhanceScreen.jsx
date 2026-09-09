import React, { useEffect, useMemo, useState } from 'react';
import WeaponCard from './WeaponCard.jsx';
import SpritePlayer from './SpritePlayer.jsx';
import { enhance, getDowngradeChance, getEnhanceCost, getSuccessRate } from '../utils/enhanceLogic.js';
import { getWeapon, getWeaponRenderConfig } from '../data/weapons.js';
import { assetUrl } from '../utils/assetUrl.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function EnhanceScreen({ state, setState }) {
  const [useProtect, setUseProtect] = useState(false);
  const [message, setMessage] = useState('결과를 기다리고 있어요! 제단이 괜히 눈치를 봅니다.');
  const [result, setResult] = useState(null);
  const [animPhase, setAnimPhase] = useState('idle');
  const [displayLevel, setDisplayLevel] = useState(state.enhanceLevel);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(null);
  const [resourceHint, setResourceHint] = useState('');

  const weapon = getWeapon(state.enhanceLevel);
  const displayWeapon = getWeapon(displayLevel);
  const displayRender = getWeaponRenderConfig(displayLevel);
  const cost = useMemo(() => getEnhanceCost(state.enhanceLevel), [state.enhanceLevel]);
  const successRate = getSuccessRate(state.enhanceLevel);
  const downRate = getDowngradeChance(state.enhanceLevel);

  const isMax = state.enhanceLevel >= 20;
  const lacksGold = state.gold < cost.goldCost;
  const lacksStone = state.stone < cost.stoneCost;
  const canEnhance = !busy && !isMax && !lacksGold && !lacksStone;

  useEffect(() => {
    if (!busy) setDisplayLevel(state.enhanceLevel);
  }, [state.enhanceLevel, busy]);

  useEffect(() => {
    if (state.protectScroll <= 0 && useProtect) setUseProtect(false);
  }, [state.protectScroll, useProtect]);

  function pulseFlash(type, ms = 420) {
    setFlash(`${type}-${Date.now()}`);
    setTimeout(() => setFlash(null), ms);
  }

  async function phase(nextPhase, ms) {
    setAnimPhase(nextPhase);
    await delay(ms);
  }

  function getButtonText() {
    if (busy) return '강화 중...';
    if (isMax) return '최대 강화';
    if (lacksGold) return '골드 부족';
    if (lacksStone) return '강화석 부족';
    return state.enhanceLevel >= 11 ? '그래도 누른다' : '강화하기!';
  }

  async function doEnhance() {
    if (busy) return;

    if (isMax) {
      const r = enhance(state, useProtect);
      setResult(r.result);
      setMessage(r.message);
      return;
    }

    if (!canEnhance) {
      const hint = lacksGold ? `골드가 부족합니다. 필요 🪙 ${cost.goldCost.toLocaleString()}` : `강화석이 부족합니다. 필요 💎 ${cost.stoneCost}`;
      setResourceHint(hint);
      setMessage(`${hint} 제단이 손을 내렸습니다.`);
      return;
    }

    setBusy(true);
    setResult(null);
    setFlash(null);
    setResourceHint('');
    setDisplayLevel(state.enhanceLevel);
    setMessage('제단이 숨을 들이마십니다. 무기가 잠깐 불안해합니다.');

    setAnimPhase('charging');
    pulseFlash('dim', 720);
    await delay(540);

    const r = enhance(state, useProtect);
    const before = state.enhanceLevel;
    const after = r.nextState.enhanceLevel;

    await phase('silhouette', 300);
    setResult(r.result);
    setMessage(r.message);

    if (r.result === 'success') {
      pulseFlash('gold', 560);
      await phase('burst success-burst', 480);
      setDisplayLevel(after);
      await phase('reveal', 720);
    } else if (r.result === 'downgrade') {
      pulseFlash('red', 520);
      await phase('downgrade-crack', 520);
      setDisplayLevel(after);
      await phase('weapon-crack-shake danger-reveal', 560);
    } else if (r.result === 'protected') {
      pulseFlash('red', 260);
      await phase('downgrade-crack pre-protect', 320);
      pulseFlash('blue', 620);
      setDisplayLevel(before);
      await phase('protect-shield', 720);
    } else {
      await phase('enhance-fail-fizzle', 380);
      pulseFlash('smoke', 500);
      setDisplayLevel(before);
      await phase('weapon-drop-sad fail', 620);
    }

    setState(r.nextState);
    setAnimPhase('settled');
    await delay(360);
    setAnimPhase('idle');
    setBusy(false);
  }

  const flashClass = flash ? `screen-flash ${flash.split('-')[0]}` : '';
  const dimOn = busy && !['idle', 'settled'].includes(animPhase);

  return (
    <main className={`enhance-v3 enhance-v4 enhance-v5 enhance-v6 ${busy ? 'enhance-busy' : ''}`}> 
      <aside className="enhance-left">
        <WeaponCard weapon={weapon} level={state.enhanceLevel} scale={0.62} />
      </aside>

      <section className={`altar-v3 altar-v4 panel ${animPhase} ${result ? `result-${result}` : ''}`}>
        {dimOn && <div className="screen-dim-overlay" />}
        {flashClass && <div className={flashClass} />}
        {(animPhase.includes('downgrade') || animPhase.includes('crack')) && <div className="crack-overlay-v6" />}
        {animPhase === 'protect-shield' && <div className="protect-shield-v6" />}
        {animPhase === 'enhance-fail-fizzle' || animPhase === 'weapon-drop-sad fail' ? <div className="fail-smoke-pop-v6">☁</div> : null}

        <div className="altar-title">강화의 제단</div>
        <div className="altar-stage altar-stage-v4 altar-stage-v6">
          <div className="altar-floor" />
          <div className="altar-pulse" />
          <div className={`weapon-on-altar-v3 weapon-on-altar-v4 weapon-on-altar-v6 ${animPhase === 'silhouette' ? 'silhouette' : ''} ${animPhase === 'reveal' || animPhase.includes('danger-reveal') ? 'pop-reveal' : ''}`}>
            <SpritePlayer key={`altar-${displayWeapon.file}-${displayLevel}`} src={assetUrl(`assets/weapons/${displayWeapon.file}`)} variant="altar" scale={displayRender.altarScale ?? displayRender.scale ?? 2.05} cropLeft={displayRender.cropLeft} cropRight={displayRender.cropRight} cropTop={displayRender.cropTop} cropBottom={displayRender.cropBottom} offsetX={displayRender.offsetX} offsetY={displayRender.offsetY} idleRotation={displayRender.idleRotation} />
          </div>
          {(animPhase === 'reveal' || animPhase.includes('danger-reveal')) && <div className="tadan-v3 tadan-v4">따단!</div>}
          {animPhase === 'protect-shield' && <div className="scroll-consumed-pop-v6">수호!</div>}
        </div>
        <div className="enhance-message panel">
          <div className="message-label">강화 결과</div>
          <p>{message}</p>
          {resourceHint && <small className="resource-hint">{resourceHint}</small>}
        </div>
      </section>

      <section className="enhance-control-v3 enhance-control-v4 panel parchment">
        <div className="two-cols">
          <div>
            <h3>강화 비용</h3>
            <div className={`cost ${lacksGold ? 'lack' : ''}`}>🪙 {cost.goldCost.toLocaleString()}</div>
            <div className={`cost ${lacksStone ? 'lack' : ''}`}>💎 {cost.stoneCost}</div>
          </div>
          <div>
            <h3>성공 확률</h3>
            <div className="big-rate">{successRate}%</div>
            <small>현재 +{state.enhanceLevel} → +{Math.min(20, state.enhanceLevel + 1)}</small>
          </div>
        </div>
        <div className="warning"><b>하락 위험</b><span>실패 시 하락 확률 {downRate}%</span></div>
        <label className={`check-row ${state.protectScroll <= 0 ? 'disabled-row' : ''}`}>
          <input type="checkbox" checked={useProtect} onChange={(e)=>setUseProtect(e.target.checked)} disabled={state.protectScroll <= 0 || busy}/>
          <span>수호 주문서 사용</span><small>보유 {state.protectScroll}개</small>
        </label>
        <button className="enhance-btn" onClick={doEnhance} disabled={!canEnhance}>{getButtonText()}</button>
        <div className="fineprint">💀 실패해도 책임지지 않습니다. 진짜임.</div>
        <div className="recent-log compact-log">
          <div className="ribbon small">최근 강화 기록</div>
          {state.logs?.length ? state.logs.slice(0,5).map((l,i)=><div key={i} className="log-item">{l}</div>) : <div className="log-item empty">아직 제단이 사고를 안 쳤습니다.</div>}
        </div>
      </section>
    </main>
  );
}
