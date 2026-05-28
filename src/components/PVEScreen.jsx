import React, { useEffect, useMemo, useRef, useState } from 'react';
import SpritePlayer from './SpritePlayer.jsx';
import RouletteWheel from './RouletteWheel.jsx';
import BattleLog from './BattleLog.jsx';
import CombatFx from './CombatFx.jsx';
import MonsterSprite from './MonsterSprite.jsx';
import FloatingText from './FloatingText.jsx';
import { getWeapon, getWeaponRenderConfig } from '../data/weapons.js';
import { getMonster } from '../data/monsters.js';
import { getAnimationPlanByResult, resultMessage } from '../utils/battleLogic.js';
import { RESULT_META } from '../data/roulette.js';
import { createTurnResult } from '../utils/rouletteLogic.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function Hearts({ hp, max }) {
  return <div className="hearts">{Array.from({ length: max }).map((_, i) => <span key={i} className={i < hp ? 'alive' : ''}>♥</span>)}</div>;
}

function clampHp(hp) { return Math.max(0, hp); }
function resultLabel(result) { return RESULT_META[result]?.label || ''; }

export default function PVEScreen({ state, setState }) {
  const weapon = getWeapon(state.enhanceLevel);
  const weaponRender = getWeaponRenderConfig(state.enhanceLevel);
  const baseBattleWeaponScale = weaponRender.battleScale ?? Number(((weaponRender.scale || 1.95) * 0.72).toFixed(2));
  const isLongBattleWeapon = ['파리채', '전기모기채', '암흑 낫', '서리 창'].includes(weapon.name);
  const battleWeaponScale = Number((baseBattleWeaponScale * (isLongBattleWeapon ? 1.12 : 1.2)).toFixed(2));
  // v0.8f: keep the v0.8e scale, but anchor the player weapon lower/left so it sits on the ground ring.
  const battleGroundAnchorOffsetX = isLongBattleWeapon ? -8 : -12;
  const battleGroundAnchorOffsetY = isLongBattleWeapon ? 38 : 44;
  const battleWeaponOffsetX = weaponRender.battleOffsetX ?? (Math.round((weaponRender.offsetX || 0) * 0.45) + battleGroundAnchorOffsetX);
  const battleWeaponOffsetY = weaponRender.battleOffsetY ?? ((weaponRender.offsetY || 0) + (isLongBattleWeapon ? 0 : 6) + battleGroundAnchorOffsetY);
  const monster = useMemo(() => getMonster(state.currentFloor), [state.currentFloor]);
  const [playerHp, setPlayerHp] = useState(3);
  const [monsterHp, setMonsterHp] = useState(3);
  const [phase, setPhase] = useState('ready');
  const [spinning, setSpinning] = useState({ player: false, monster: false });
  const [result, setResult] = useState({ player: null, monster: null });
  const [turnResult, setTurnResult] = useState({ player: null, monster: null });
  const [logs, setLogs] = useState(state.pveLogs || []);
  const [message, setMessage] = useState('룰렛을 돌려 공격을 확정하세요. 몬스터가 눈치를 보고 있습니다.');
  const [playerAttack, setPlayerAttack] = useState(false);
  const [playerMiss, setPlayerMiss] = useState(false);
  const [monsterAttack, setMonsterAttack] = useState(false);
  const [monsterMiss, setMonsterMiss] = useState(false);
  const [combatFx, setCombatFx] = useState(null);
  const [floatingText, setFloatingText] = useState(null);
  const [battleFx, setBattleFx] = useState('');
  const [monsterState, setMonsterState] = useState('idle');
  const [rewardPopup, setRewardPopup] = useState(null);
  const [defeatReward, setDefeatReward] = useState(null);
  const [playerWeaponState, setPlayerWeaponState] = useState('idle');
  const [ended, setEnded] = useState(false);
  const activeTurnRef = useRef(null);
  const playerHpRef = useRef(playerHp);
  const monsterHpRef = useRef(monsterHp);
  const endedRef = useRef(ended);
  playerHpRef.current = playerHp;
  monsterHpRef.current = monsterHp;
  endedRef.current = ended;

  useEffect(() => { resetBattle(); }, [state.currentFloor]);
  useEffect(() => () => { activeTurnRef.current = null; }, []);

  function push(line) {
    setLogs((prev) => [line, ...prev].slice(0, 12));
  }

  function resetBattle() {
    activeTurnRef.current = null;
    setPlayerHp(3);
    setMonsterHp(3);
    setPhase('ready');
    setSpinning({ player: false, monster: false });
    setResult({ player: null, monster: null });
    setTurnResult({ player: null, monster: null });
    setCombatFx(null);
    setFloatingText(null);
    setBattleFx('');
    setEnded(false);
    setPlayerAttack(false);
    setPlayerMiss(false);
    setMonsterAttack(false);
    setMonsterMiss(false);
    setMonsterState('appearing');
    setRewardPopup(null);
    setDefeatReward(null);
    setPlayerWeaponState('idle');
    setMessage(`${state.currentFloor}층 몬스터가 나타났습니다. 이번엔 누가 먼저 민망해질까요?`);
    setTimeout(() => setMonsterState('idle'), 520);
  }

  async function winSequence() {
    if (endedRef.current) return;
    setEnded(true);
    endedRef.current = true;
    setPhase('monsterDying');
    setMonsterState('dying');
    setMessage('승리! 몬스터가 먼지가 되어 사라집니다. 주머니를 뒤져봅니다.');
    setCombatFx({ target: 'monster', type: 'victory', key: `death-${Date.now()}` });
    await delay(850);

    const gold = 200 + state.currentFloor * 80;
    const stone = 1 + Math.floor(state.currentFloor / 5);
    setRewardPopup({ gold, stone, floor: state.currentFloor });
    push(`승리! 🪙${gold}, 💎${stone} 획득. 다음 층 문이 삐걱 열렸습니다.`);
    setMessage(`+${gold} 골드, +${stone} 강화석 획득! 다음 층으로 이동합니다.`);
    await delay(900);

    const current = state.currentFloor;
    const nextFloor = Math.min(20, current + 1);
    const next = {
      ...state,
      gold: state.gold + gold,
      stone: state.stone + stone,
      currentFloor: nextFloor,
      bestFloor: Math.max(state.bestFloor, nextFloor),
      pveLogs: [`승리! 🪙${gold}, 💎${stone} 획득`, ...logs].slice(0, 10)
    };
    if (current >= 20) {
      next.currentFloor = 20;
      next.bestFloor = Math.max(state.bestFloor, 20);
      setMessage('현재 프로토타입 최고층입니다. 던전 문이 닫혔습니다. 개발자가 열쇠를 아직 안 만들었습니다.');
      setPhase('result');
    }
    setState(next);
  }

  async function loseSequence() {
    if (endedRef.current) return;
    setEnded(true);
    endedRef.current = true;
    activeTurnRef.current = null;
    setSpinning({ player: false, monster: false });
    setCombatFx(null);
    setFloatingText(null);
    setBattleFx('');

    setPhase('playerDying');
    setPlayerWeaponState('defeated');
    setMessage('패배... 무기가 잠깐 누웠습니다. 제단이 멀리서 손짓합니다.');
    await delay(760);

    const gold = 50 + state.currentFloor * 20;
    setDefeatReward({ gold, floor: state.currentFloor });
    setPhase('defeatReveal');
    push(`패배... 위로금 🪙${gold}. 현재 ${state.currentFloor}층은 유지됩니다.`);
    setMessage(`패배... 위로금 ${gold} 골드 획득. 현재 층은 유지됩니다.`);
    await delay(620);

    const next = {
      ...state,
      gold: state.gold + gold,
      pveLogs: [`패배... 위로금 🪙${gold}`, ...logs].slice(0, 10)
    };
    setState(next);
    setPhase('defeatResult');
  }

  function retryBattle() {
    activeTurnRef.current = null;
    setPlayerHp(3);
    setMonsterHp(3);
    setPhase('ready');
    setSpinning({ player: false, monster: false });
    setResult({ player: null, monster: null });
    setTurnResult({ player: null, monster: null });
    setCombatFx(null);
    setFloatingText(null);
    setBattleFx('');
    setEnded(false);
    endedRef.current = false;
    setPlayerAttack(false);
    setPlayerMiss(false);
    setMonsterAttack(false);
    setMonsterMiss(false);
    setMonsterState('appearing');
    setRewardPopup(null);
    setDefeatReward(null);
    setPlayerWeaponState('idle');
    setMessage(`${state.currentFloor}층에서 다시 도전합니다. 무기가 먼지를 털고 일어납니다.`);
    setTimeout(() => setMonsterState('idle'), 520);
  }

  function goEnhance() {
    setState((prev) => ({ ...prev, activeTab: 'enhance' }));
  }

  function onPlayerStart() {
    if (!['ready', 'playerTurn'].includes(phase) || endedRef.current || activeTurnRef.current) return;
    setPhase('playerSpin');
    setResult((r) => ({ ...r, player: null }));
    setTurnResult((r) => ({ ...r, player: null }));
    setMessage('내 공격 룰렛이 돌아갑니다. 타이밍이 생명입니다. 대충 생명입니다.');
    setSpinning((s) => ({ ...s, player: true }));
  }

  async function playPlayerResult(turn) {
    const plan = getAnimationPlanByResult(turn.result);
    const line = resultMessage(`+${state.enhanceLevel} ${weapon.name}`, turn.result);
    setPhase('playerResultReveal');
    push(line);
    setMessage(line);
    await delay(520);

    if (!turn.shouldAttack || plan.type === 'miss') {
      setPhase('missReaction');
      setPlayerMiss(true);
      setMessage(`${line} 무기가 제자리에서 머쓱하게 휘청입니다.`);
      await delay(820);
      setPlayerMiss(false);
      setPhase('playerReturn');
      await delay(220);
      return monsterHpRef.current;
    }

    setPhase('playerAction');
    setPlayerAttack(true);
    setMessage(`${line} 무기가 뒤로 젖혀졌다가 휘두릅니다!`);
    await delay(520);

    setPhase('impact');
    if (turn.result === 'special') {
      setBattleFx('battle-special-cinematic battle-shake-special');
      setMessage(`${line} 화면이 잠깐 조용해졌다가 터집니다!`);
      await delay(180);
    } else if (turn.result === 'heavy') {
      setBattleFx('battle-shake-heavy battle-hit-stop');
    } else {
      setBattleFx('battle-hit-light');
    }
    setCombatFx({ target: 'monster', type: turn.result, key: `m-css-hit-${turn.id}` });
    setFloatingText({ target: 'monster', type: turn.result, text: `${resultLabel(turn.result)}! -${turn.damage} HP`, key: `m-float-${turn.id}` });
    setMonsterState(`hit-${turn.result}`);
    const nextHp = clampHp(monsterHpRef.current - turn.damage);
    setMonsterHp(nextHp);
    await delay(turn.result === 'special' ? 920 : turn.result === 'heavy' ? 760 : 560);

    setBattleFx('');
    setMonsterState('idle');
    setPhase('playerReturn');
    await delay(360);
    setPlayerAttack(false);
    return nextHp;
  }

  async function playMonsterResult(turn) {
    const plan = getAnimationPlanByResult(turn.result);
    const monsterLine = resultMessage(monster.name, turn.result);
    setPhase('monsterResultReveal');
    push(monsterLine);
    setMessage(monsterLine);
    await delay(520);

    if (!turn.shouldAttack || plan.type === 'miss') {
      setPhase('monsterMiss');
      setMonsterMiss(true);
      setMessage(`${monsterLine} 몬스터가 멋쩍게 허공을 봅니다.`);
      await delay(760);
      setMonsterMiss(false);
      setPhase('monsterReturn');
      await delay(220);
      return playerHpRef.current;
    }

    setPhase('monsterAction');
    setMonsterAttack(true);
    setMessage(`${monsterLine} 몬스터가 몸을 튕겨 공격합니다!`);
    await delay(500);

    setPhase('playerHit');
    if (turn.result === 'special') setBattleFx('battle-shake-special');
    else if (turn.result === 'heavy') setBattleFx('battle-shake-heavy');
    setCombatFx({ target: 'player', type: turn.result, key: `p-css-hit-${turn.id}` });
    setFloatingText({ target: 'player', type: turn.result, text: `-${turn.damage} HP`, key: `p-float-${turn.id}` });
    const pHp = clampHp(playerHpRef.current - turn.damage);
    setPlayerHp(pHp);
    await delay(turn.result === 'special' ? 820 : 600);
    setBattleFx('');

    setMonsterAttack(false);
    setPhase('monsterReturn');
    await delay(260);
    return pHp;
  }

  async function onPlayerStop(turn) {
    if (phase !== 'playerSpin' || endedRef.current || activeTurnRef.current) return;
    activeTurnRef.current = turn;

    setPhase('playerStopping');
    setSpinning((s) => ({ ...s, player: false }));
    setTurnResult((r) => ({ ...r, player: turn }));
    setResult((r) => ({ ...r, player: turn.result }));

    const nextHp = await playPlayerResult(turn);
    activeTurnRef.current = null;
    if (nextHp <= 0) {
      await winSequence();
      return;
    }

    setPhase('monsterSpin');
    setResult((r) => ({ ...r, monster: null }));
    setTurnResult((r) => ({ ...r, monster: null }));
    setMessage(`${monster.name}의 룰렛이 돌아갑니다. 표정이 수상합니다.`);
    setSpinning((s) => ({ ...s, monster: true }));
    await delay(1050);
    const monsterTurn = createTurnResult('monster', monster.roulette);
    setPhase('monsterStopping');
    setSpinning((s) => ({ ...s, monster: false }));
    setTurnResult((r) => ({ ...r, monster: monsterTurn }));
    setResult((r) => ({ ...r, monster: monsterTurn.result }));

    const pHp = await playMonsterResult(monsterTurn);
    if (pHp <= 0) await loseSequence();
    else {
      setPhase('playerTurn');
      setMessage('다시 내 차례입니다. 룰렛이 손짓합니다. 위험한 손짓입니다.');
    }
  }

  const inputLocked = !['ready', 'playerTurn', 'playerSpin'].includes(phase) || ended || activeTurnRef.current !== null;

  return (
    <main className={`pve-v3 pve-v4 pve-v5 pve-v6 pve-v7 pve-v7b pve-v8 pve-v8d pve-v8f phase-${phase} ${battleFx}`}>
      <aside className="pve-info panel parchment">
        <div className="ribbon">PVE 모험</div>
        <h2>악마의 동굴 {state.currentFloor}층</h2>
        <p className="reward-line">클리어 보상 🪙 {200 + state.currentFloor * 80} / 💎 {1 + Math.floor(state.currentFloor / 5)}</p>
        <div className="progress-line">진행도 <span>{state.currentFloor}/20</span></div>
        <div className="mini-objective">승리 조건: 몬스터 HP 0<br />실패는 공격하지 않습니다.</div>
        <div className="pve-mini-weapon">
          <b>내 무기</b>
          <span>+{state.enhanceLevel} {weapon.name}</span>
          <small>{weapon.specialName}</small>
        </div>
        <button className="ghost-btn" onClick={resetBattle} disabled={!['ready', 'playerTurn', 'result', 'defeatResult'].includes(phase)}>전투 재시작</button>
      </aside>

      <section className={`battle-arena-v3 battle-arena-v4 battle-arena-v5 panel phase-${phase} ${battleFx}`}>
        <div className={`monster-zone-v3 monster-zone-v4 monster-zone-v5 floating-combat-unit ${monsterAttack ? 'monster-lunge' : ''} ${monsterMiss ? 'monster-miss-wobble' : ''} ${monsterState}`}>
          <div className="battle-unit-hud monster-status-hud">
            <div className="nameplate">{monster.name}</div>
            <Hearts hp={monsterHp} max={3} />
          </div>
          <MonsterSprite monster={monster} state={monsterState} />
          {monsterMiss && <div className="miss-bubble monster-miss-bubble">...</div>}
          {combatFx?.target === 'monster' && (
            <CombatFx type={combatFx.type} target="monster" playKey={combatFx.key} onDone={() => setCombatFx(null)} />
          )}
          {floatingText?.target === 'monster' && (
            <FloatingText type={floatingText.type} target="monster" text={floatingText.text} playKey={floatingText.key} onDone={() => setFloatingText(null)} />
          )}
        </div>

        <div className="vs-mark-v3">VS</div>

        <div className={`player-zone-v3 player-zone-v4 player-zone-v5 player-zone-v6 player-zone-v7 floating-combat-unit ${playerWeaponState === 'defeated' ? 'player-weapon-defeated' : ''} ${playerMiss ? 'weapon-miss-wobble' : ''}`}>
          <div className="battle-unit-hud player-status-hud">
            <div className="nameplate">+{state.enhanceLevel} {weapon.name}</div>
            <Hearts hp={playerHp} max={3} />
          </div>
          <div className="battle-aura-ring player-aura" />
          <div className="weapon-shadow" />
          <div className={`weapon-unit-v6 ${playerAttack ? 'weapon-unit-attack-v6' : ''}`}>
            <div className={`weapon-pivot-v6 ${playerAttack ? 'weapon-pivot-swing-v6' : ''}`}>
              <SpritePlayer
                key={`pve-${weapon.file}-${state.enhanceLevel}`}
                src={`/assets/weapons/${weapon.file}`}
                playing={playerAttack}
                loop={false}
                variant="battle"
                scale={battleWeaponScale}
                fps={12}
                cropLeft={weaponRender.cropLeft}
                cropRight={weaponRender.cropRight}
                cropTop={weaponRender.cropTop}
                cropBottom={weaponRender.cropBottom}
                offsetX={battleWeaponOffsetX}
                offsetY={battleWeaponOffsetY}
                idleRotation={weaponRender.idleRotation}
              />
            </div>
          </div>
          {playerMiss && <div className="miss-bubble player-miss-bubble">💦<small>...</small></div>}
          {combatFx?.target === 'player' && (
            <CombatFx type={combatFx.type} target="player" playKey={combatFx.key} onDone={() => setCombatFx(null)} />
          )}
          {floatingText?.target === 'player' && (
            <FloatingText type={floatingText.type} target="player" text={floatingText.text} playKey={floatingText.key} onDone={() => setFloatingText(null)} />
          )}
        </div>

        {['playerResultReveal', 'monsterResultReveal'].includes(phase) && (
          <div className={`turn-result-reveal-v6 ${(phase === 'playerResultReveal' ? result.player : result.monster) || ''}`}>
            <b>{phase === 'playerResultReveal' ? '내 판정' : '몬스터 판정'}</b>
            <span>{resultLabel(phase === 'playerResultReveal' ? result.player : result.monster)}</span>
          </div>
        )}

        {['playerDying', 'defeatReveal', 'defeatResult'].includes(phase) && (
          <div className="defeat-dim-overlay-v7" />
        )}

        {['defeatReveal', 'defeatResult'].includes(phase) && (
          <div className="defeat-panel-v7">
            <div className="defeat-banner-v7">패배...</div>
            <p>무기가 잠깐 누웠습니다. 제단이 멀리서 손짓합니다.</p>
            <div className="defeat-reward-pop-v7">위로금 🪙 {defeatReward?.gold ?? (50 + state.currentFloor * 20)}</div>
            <small>현재 {state.currentFloor}층은 유지됩니다.</small>
            {phase === 'defeatResult' && (
              <div className="defeat-actions-v7">
                <button className="primary-action retry-action" onClick={retryBattle}>다시 도전</button>
                <button className="ghost-btn enhance-action" onClick={goEnhance}>강화하러 가기</button>
              </div>
            )}
          </div>
        )}

        {rewardPopup && (
          <div className="reward-popup-v3 reward-popup-v4">
            <b>보상 획득!</b>
            <span>🪙 {rewardPopup.gold} / 💎 {rewardPopup.stone}</span>
            <small>{Math.min(20, rewardPopup.floor + 1)}층으로 이동!</small>
          </div>
        )}

        <div className="battle-message-v3 battle-message-v4">{message}</div>
      </section>

      <aside className="pve-roulette-panel panel">
        <RouletteWheel title="내 공격 판정판" weights={weapon.roulette} actor="player" active={!inputLocked || phase === 'playerSpin'} spinning={spinning.player} result={result.player} turnResult={turnResult.player} onStart={onPlayerStart} onStop={onPlayerStop} compact disabled={activeTurnRef.current !== null} />
        <RouletteWheel title="몬스터 판정판" weights={monster.roulette} actor="monster" active={false} spinning={spinning.monster} result={result.monster} turnResult={turnResult.monster} auto compact />
      </aside>

      <BattleLog title="상세 전투 기록" logs={logs} compact />
    </main>
  );
}
