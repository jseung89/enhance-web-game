import React, { useMemo, useRef, useState } from 'react';
import SpritePlayer from './SpritePlayer.jsx';
import EffectPlayer from './EffectPlayer.jsx';
import RouletteWheel from './RouletteWheel.jsx';
import BattleLog from './BattleLog.jsx';
import { getWeapon, weapons, getWeaponRenderConfig } from '../data/weapons.js';
import { resultMessage } from '../utils/battleLogic.js';
import { createTurnResult } from '../utils/rouletteLogic.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function Hearts({ hp, max }) { return <div className="hearts">{Array.from({length:max}).map((_,i)=><span key={i} className={i<hp?'alive':''}>♥</span>)}</div>; }
function randomOpponent(playerLevel, seed = 0) {
  const presets = ['녹슨 전기톱','삐딱한 대검','수상한 숟가락왕','보라빛 철퇴'];
  const spread = (seed % 9) - 4;
  const level = Math.max(0, Math.min(20, playerLevel + spread + Math.floor(Math.random()*3)-1));
  return { name: presets[seed % presets.length], level, weapon: weapons[level] };
}
const roomSeed = [3, 7, 12, 18];

export default function PVPScreen({ state, setState }) {

  return (
    <main className="pvp-locked-screen panel">
      <div className="pvp-lock-card">
        <div className="pvp-lock-badge">준비중 🔒</div>
        <h2>PVP 결투는 아직 잠겨 있습니다</h2>
        <p>프리시즌 랭킹과 서버 저장 구조가 준비된 뒤 오픈할 예정입니다.</p>
        <small>현재 패치에서는 기존 PVP 코드를 보존하고, 사용자가 완성 기능으로 오해하지 않도록 진입만 잠급니다.</small>
      </div>
    </main>
  );

  const playerWeapon = getWeapon(state.enhanceLevel);
  const playerRender = getWeaponRenderConfig(state.enhanceLevel);
  const rooms = useMemo(() => roomSeed.map((s, i) => {
    const op = randomOpponent(state.enhanceLevel, s);
    return { id:i+1, status:i===1?'대기중':i===2?'전투중':'입장 가능', opponent:op, power: 1000 + op.level * 95 };
  }), [state.enhanceLevel]);
  const [mode, setMode] = useState('lobby');
  const [room, setRoom] = useState(null);
  const [opponent, setOpponent] = useState(() => randomOpponent(state.enhanceLevel, 5));
  const [myHp, setMyHp] = useState(5);
  const [opHp, setOpHp] = useState(5);
  const [turn, setTurn] = useState('player');
  const [spinning, setSpinning] = useState({ player:false, enemy:false });
  const [result, setResult] = useState({ player:null, enemy:null });
  const [turnResult, setTurnResult] = useState({ player:null, enemy:null });
  const [logs, setLogs] = useState(state.pvpLogs || []);
  const [playerAttack, setPlayerAttack] = useState(false);
  const [enemyAttack, setEnemyAttack] = useState(false);
  const [effect, setEffect] = useState(null);
  const [ended, setEnded] = useState(false);
  const myHpRef = useRef(myHp); const opHpRef = useRef(opHp);
  myHpRef.current = myHp; opHpRef.current = opHp;

  function push(line) { setLogs(prev => [line, ...prev].slice(0,12)); }
  function enterRoom(r) {
    const op = r.opponent;
    setRoom(r); setOpponent(op); setMyHp(5); setOpHp(5); setEnded(false); setResult({player:null,enemy:null}); setTurnResult({player:null,enemy:null}); setSpinning({player:false,enemy:false}); setEffect(null); setPlayerAttack(false); setEnemyAttack(false);
    const first = state.enhanceLevel >= op.level ? 'player' : 'enemy';
    setTurn(first); setMode('battle'); setLogs([`방 ${r.id} 입장! 상대 +${op.level} ${op.weapon.name} 등장.`, first==='player'?'내가 선공입니다. 룰렛이 손목을 풉니다.':'상대가 선공입니다. 대장장이가 침묵합니다.']);
    if (first === 'enemy') setTimeout(() => enemyAutoTurn(op), 650);
  }
  function leaveRoom() { setMode('lobby'); setRoom(null); }
  function finish(win) {
    if (ended) return; setEnded(true);
    const next = { ...state };
    if (win) { next.gold += 300; next.stone += 2; next.pvpWins += 1; push('승리! 보상 🪙300, 💎2. 상대 무기가 잠깐 조용해졌다.'); }
    else { next.gold += 100; next.pvpLosses += 1; push('패배... 위로금 🪙100. 대장장이가 멀리서 손짓한다.'); }
    next.pvpLogs = logs.slice(0, 10); setState(next);
  }
  async function enemyAutoTurn(currentOpponent = opponent) {
    if (ended) return;
    setTurn('enemy'); setSpinning(s=>({...s, enemy:true}));
    await delay(1100);
    const turn = createTurnResult('enemy', currentOpponent.weapon.roulette);
    setSpinning(s=>({...s, enemy:false})); setTurnResult(r=>({...r, enemy:turn})); setResult(r=>({...r, enemy:turn.result}));
    push(resultMessage(`상대 +${currentOpponent.level} ${currentOpponent.weapon.name}`, turn.result));
    await delay(250);
    if (turn.shouldAttack) { setEnemyAttack(true); await delay(330); setEffect({ target:'me', file:turn.effect, key:turn.id }); }
    const hp = Math.max(0, myHpRef.current - turn.damage); setMyHp(hp);
    await delay(760); setEnemyAttack(false);
    if (hp <= 0) finish(false); else setTurn('player');
  }
  function onStart() { if (turn==='player' && !ended) setSpinning(s=>({...s, player:true})); }
  async function onStop(turnObj) {
    if (turn !== 'player' || ended) return;
    const turn = turnObj?.result ? turnObj : createTurnResult('player', playerWeapon.roulette);
    setSpinning(s=>({...s, player:false})); setTurnResult(r=>({...r, player:turn})); setResult(r=>({...r, player:turn.result}));
    push(resultMessage(`나 +${state.enhanceLevel} ${playerWeapon.name}`, turn.result));
    await delay(250);
    if (turn.shouldAttack) { setPlayerAttack(true); await delay(330); setEffect({ target:'opponent', file:turn.effect, key:turn.id }); }
    const hp = Math.max(0, opHpRef.current - turn.damage); setOpHp(hp);
    await delay(760); setPlayerAttack(false);
    if (hp <= 0) finish(true); else setTimeout(() => enemyAutoTurn(opponent), 400);
  }

  if (mode === 'lobby') {
    return (
      <main className="pvp-lobby-v2">
        <aside className="pvp-side panel parchment"><div className="ribbon">PVP 결투</div><h2>랭킹 포인트</h2><div className="big-rate">{1250 + state.pvpWins*25 - state.pvpLosses*20}</div><p>승리 {state.pvpWins} / 패배 {state.pvpLosses}</p><p className="tiny-help">디스코드 친구들이 들어올 4개 결투방 프로토타입입니다.</p></aside>
        <section className="room-grid panel">
          <div className="room-header"><h2>결투방 선택</h2><span>방에 들어가면 AI 상대가 즉시 채워집니다.</span></div>
          {rooms.map((r) => <div key={r.id} className={`room-card ${r.status==='전투중'?'locked':''}`}>
            <div className="room-no">방 {r.id}</div><div className="room-status">{r.status}</div>
            <div className="room-members"><b>나</b><span>+{state.enhanceLevel} {playerWeapon.name}</span><b>상대</b><span>+{r.opponent.level} {r.opponent.weapon.name}</span></div>
            <div className="room-power">추천 전투력 {r.power}</div>
            <button className="enter-room" disabled={r.status==='전투중'} onClick={() => enterRoom(r)}>{r.status==='전투중'?'전투중':'입장하기'}</button>
          </div>)}
        </section>
      </main>
    );
  }

  return (
    <main className="pvp-battle-v2">
      <aside className="pvp-side panel parchment"><div className="ribbon">PVP 방 {room?.id}</div><h2>랭킹 포인트</h2><div className="big-rate">{1250 + state.pvpWins*25 - state.pvpLosses*20}</div><p>승리 {state.pvpWins} / 패배 {state.pvpLosses}</p><button onClick={leaveRoom} className="ghost-btn">방 나가기</button></aside>
      <section className="duel-field-v2 panel">
        <div className={`opponent-duel floating-combat-unit ${enemyAttack?'enemy-lunge':''}`}>
          <div className="nameplate">상대 +{opponent.level} {opponent.weapon.name}</div><Hearts hp={opHp} max={5}/>
          <div className="battle-aura-ring pvp-aura" />
          <SpritePlayer src={`/assets/weapons/${opponent.weapon.file}`} playing={enemyAttack} mirrored scale={0.78} variant="pvp" onDone={() => setEnemyAttack(false)} />
          {effect?.target==='opponent' && <EffectPlayer playKey={effect.key} src={`/assets/effects/${effect.file}`} className="hit-effect duel-hit-op" scale={0.22} onDone={() => setEffect(null)} />} 
        </div>
        <div className="duel-vs">VS</div>
        <div className={`my-duel floating-combat-unit ${playerAttack?'weapon-lunge-up':''}`}>
          <div className="nameplate">나 +{state.enhanceLevel} {playerWeapon.name}</div><Hearts hp={myHp} max={5}/>
          <div className="battle-aura-ring pvp-aura" />
          <SpritePlayer src={`/assets/weapons/${playerWeapon.file}`} playing={playerAttack} variant="pvp" scale={Math.max(0.78, (playerRender.battleScale ?? playerRender.scale ?? 1.8) * 0.42)} cropLeft={playerRender.cropLeft} cropRight={playerRender.cropRight} cropTop={playerRender.cropTop} cropBottom={playerRender.cropBottom} offsetX={playerRender.offsetX} offsetY={playerRender.offsetY} idleRotation={playerRender.idleRotation} onDone={() => setPlayerAttack(false)} />
          {effect?.target==='me' && <EffectPlayer playKey={effect.key} src={`/assets/effects/${effect.file}`} className="hit-effect duel-hit-me" scale={0.22} onDone={() => setEffect(null)} />} 
        </div>
      </section>
      <section className="pvp-roulette-stack">
        <RouletteWheel title={turn==='enemy'?'상대의 차례':'상대 판정판'} weights={opponent.weapon.roulette} actor="enemy" active={false} spinning={spinning.enemy} result={result.enemy} turnResult={turnResult.enemy} compact auto />
        <RouletteWheel title={turn==='player'?'나의 차례':'내 판정판'} weights={playerWeapon.roulette} actor="player" active={turn==='player' && !ended} spinning={spinning.player} result={result.player} turnResult={turnResult.player} onStart={onStart} onStop={onStop} compact />
      </section>
      <BattleLog title="전투 기록" logs={logs}/>
    </main>
  );
}
