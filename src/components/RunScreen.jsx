import React, { useEffect, useRef, useState } from 'react';
import SpritePlayer from './SpritePlayer.jsx';
import MonsterSprite from './MonsterSprite.jsx';
import { getWeapon, getWeaponRenderConfig } from '../data/weapons.js';
import { getMonster } from '../data/monsters.js';
import { assetUrl } from '../utils/assetUrl.js';
import { getSuccessRate } from '../utils/enhanceLogic.js';
import { startRun, upgradeRun, enterRunBattle, attackRun, chooseRunReward, enemyMaxHp, RUN_REWARDS } from '../utils/runLogic.js';
import './run.css';

export default function RunScreen({ state, setState }) {
  const run = state.expedition;
  const [attacking, setAttacking] = useState(false);
  const attackLock = useRef(false);
  const attackTimer = useRef(null);
  useEffect(() => () => clearTimeout(attackTimer.current), []);
  function attack() {
    if (attackLock.current || run?.phase !== 'battle') return;
    attackLock.current = true;
    setAttacking(true);
    act(attackRun);
    attackTimer.current = setTimeout(() => { attackLock.current = false; setAttacking(false); }, 650);
  }
  const start = () => {
    const expedition = startRun();
    setState(prev => ({ ...prev, expedition }));
  };
  function act(reducer) {
    setState(prev => {
      if (!prev.expedition) return prev;
      const next = reducer(prev.expedition);
      const finished = !['won','lost'].includes(prev.expedition.phase) && ['won','lost'].includes(next.phase);
      return { ...prev, expedition: next, runRecords: finished
        ? [{ seed: next.seed, stage: next.stage, result: next.phase, turns: next.turns, level: next.level }, ...(prev.runRecords ?? [])].slice(0,20)
        : prev.runRecords };
    });
  }
  if (!run) return <main className="run-page panel"><p className="eyebrow">NINE ROOMS / ONE CHANCE</p><h1>아홉 개의 문</h1><p>강화하고, 싸우고, 전리품을 고르세요. 세 번째·여섯 번째·아홉 번째 문에는 보스가 기다립니다.</p><p>원정 전용 무기와 재화로 시작합니다. 기존 장비와 골드는 그대로 보관됩니다. 진행은 자동 저장됩니다.</p><button className="primary-btn" onClick={start}>첫 원정 떠나기</button></main>;
  const weapon = getWeapon(run.level), render = getWeaponRenderConfig(run.level), monster = getMonster(run.stage);
  const ended = ['won','lost'].includes(run.phase), boss = run.stage % 3 === 0;
  const lastAttack = run.events?.at(-1);
  return <main className="run-page panel" data-phase={run.phase}>
    <div className="run-heading"><div><p className="eyebrow">아홉 개의 문</p><h1>{ended ? run.phase === 'won' ? '끝까지 살아남았다.' : '다음에는 한 문 더.' : `${run.stage}번째 문${boss ? ' · 보스' : ''}`}</h1></div><strong>원정 체력 {run.hp}/{run.maxHp} · 강화석 {run.stones}</strong></div>
    <ol className="run-route" aria-label="원정 진행">{Array.from({length:9},(_,i)=><li key={i} aria-current={run.stage===i+1?'step':undefined} className={i+1<run.stage?'cleared':''}>{i+1}{(i+1)%3===0?' ♛':''}</li>)}</ol>
    <div className="run-health"><label htmlFor="run-hp">내 체력 · {run.hp}/{run.maxHp}</label><progress id="run-hp" value={run.hp} max={run.maxHp}/><span>{ended ? '원정 종료' : run.phase === 'reward' ? '보상을 선택하면 다음 문으로 이동합니다' : `다음 보스: ${Math.ceil(run.stage/3)*3}번째 문`}</span></div>
    <div className={`run-arena${attacking ? ' is-attacking' : ''}`}>
      <section className="run-fighter"><h2>+{run.level} {weapon.name}</h2><div className="run-art"><SpritePlayer playing={attacking} fps={10} src={assetUrl(`assets/weapons/${weapon.file}`)} variant="altar" scale={render.altarScale ?? render.scale ?? 2} cropLeft={render.cropLeft} cropRight={render.cropRight} cropTop={render.cropTop} cropBottom={render.cropBottom} offsetX={render.offsetX} offsetY={render.offsetY}/></div><p>적중 추가 피해 +{Math.floor(run.level/4)+run.damageBonus}</p></section>
      <span className="run-versus" aria-hidden="true">VS</span>
      <section className="run-fighter"><h2>{boss?'보스 · ':''}{monster.name}</h2><div className="run-art"><MonsterSprite key={monster.name} monster={monster} state={run.enemyHp===0?'dying':'idle'}/>{attacking && lastAttack?.action==='attack' && <span className="run-impact" aria-hidden="true">{lastAttack.damage ? `−${lastAttack.damage}` : '빗나감'}</span>}</div><label className="run-enemy-health">적 체력 {run.enemyHp}/{enemyMaxHp(run.stage)}<progress value={run.enemyHp} max={enemyMaxHp(run.stage)}/></label></section>
    </div>
    <div className="run-actions">
      {run.phase==='prepare'&&<><p>이번 전투 전 강화 {run.upgrades}/4회 · 성공률 {getSuccessRate(run.level)}% · 실패 시 단계 유지</p><button onClick={()=>act(upgradeRun)} disabled={run.stones<1||run.upgrades>=4||run.level>=20}>강화석 1개로 한 번 더</button><button className="primary-btn" onClick={()=>act(enterRunBattle)}>이 무기로 도전</button></>}
      {run.phase==='battle'&&<><p>내 공격 → 살아남은 적의 반격. 적을 쓰러뜨리면 반격받지 않습니다.</p><button className="primary-btn" disabled={attacking} onClick={attack}>{attacking ? '공격 중…' : '공격 / 다음 턴'}</button></>}
      {run.phase==='reward'&&<><h2>전리품 하나를 챙기세요</h2><p>공통 보상: 체력 3 회복 · 강화석 2개</p><div className="run-rewards">{RUN_REWARDS.map(reward=>{const preview=chooseRunReward(run,reward.id);return <button key={reward.id} disabled={attacking} onClick={()=>act(r=>chooseRunReward(r,reward.id))}><span className="run-reward-icon" aria-hidden="true">{reward.id==='supplies'?'✚':reward.id==='edge'?'⚒':'◇'}</span><strong>{reward.name}</strong><span>{reward.description}</span><small>선택 후 체력 {preview.hp}/{preview.maxHp} · 강화석 {preview.stones}<br/>강화 +{preview.level} · 적중 추가 피해 +{Math.floor(preview.level/4)+preview.damageBonus}</small></button>;})}</div></>}
      {ended&&<><p>{run.turns}턴 · 최종 강화 +{run.level} · 최고 도달 {run.stage}번째 문</p><button className="primary-btn" onClick={start}>새 원정 떠나기</button></>}
    </div>
    <p className="run-latest" role="status">{run.log[0]}</p>
    <details><summary>전투 기록</summary><ol>{run.log.map((line,index)=><li key={index}>{line}</li>)}</ol></details>
  </main>;
}
