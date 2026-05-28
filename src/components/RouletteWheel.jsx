import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RESULT_META, resultOrder } from '../data/roulette.js';
import { buildRouletteSegments, createTurnResult, getWheelRotationForTargetAngle, segmentCenterDegrees } from '../utils/rouletteLogic.js';

const colors = { miss: '#c85665', light: '#efd06a', heavy: '#63a8c8', special: '#8b61d7' };
const icons = { miss: '☠', light: '⚔', heavy: '💥', special: '✦' };

export default function RouletteWheel({
  title,
  weights,
  active = false,
  spinning = false,
  result,
  onStart,
  onStop,
  compact = false,
  auto = false,
  actor = 'player',
  turnResult = null,
  disabled = false
}) {
  const [rotation, setRotation] = useState(0);
  const stopLockRef = useRef(false);
  const lastAlignedResultRef = useRef(null);

  const segments = useMemo(() => buildRouletteSegments(weights), [weights]);
  const gradient = useMemo(() => {
    return segments.map((seg) => `${colors[seg.result]} ${seg.startPercent}% ${seg.endPercent}%`).join(', ');
  }, [segments]);

  const iconPositions = useMemo(() => {
    return segments.map((seg) => ({ key: seg.result, angle: seg.centerDeg, val: Math.round(seg.percent) }));
  }, [segments]);

  useEffect(() => {
    if (spinning) {
      stopLockRef.current = false;
      setRotation((r) => r + 720 + Math.random() * 720);
    }
  }, [spinning]);

  // When parent already resolved an auto turn, force the wheel to visually land on that same result.
  useEffect(() => {
    if (!result || spinning) return;
    const alignKey = `${result}-${turnResult?.id || ''}`;
    if (lastAlignedResultRef.current === alignKey) return;
    lastAlignedResultRef.current = alignKey;
    const targetAngle = turnResult?.targetAngle ?? segmentCenterDegrees(weights, result);
    setRotation((r) => getWheelRotationForTargetAngle(r, targetAngle, 2));
  }, [result, spinning, turnResult, weights]);

  function start() {
    if (!active || spinning || disabled) return;
    stopLockRef.current = false;
    setRotation((r) => r + 720 + Math.random() * 360);
    onStart?.();
  }

  function stop() {
    if (!active || !spinning || disabled || stopLockRef.current) return;
    stopLockRef.current = true;

    const turn = createTurnResult(actor, weights);
    setRotation((r) => getWheelRotationForTargetAngle(r, turn.targetAngle, 4));
    setTimeout(() => onStop?.(turn), 660);
  }

  return (
    <div className={`roulette-card ${compact ? 'compact' : ''} ${active ? 'active' : ''} ${spinning ? 'is-spinning' : ''}`}>
      <div className="roulette-title">{title}</div>
      <div className="roulette-layout">
        <div className="wheel-wrap">
          <div className="wheel-pointer">▼</div>
          <div className={`wheel ${spinning ? 'spinning' : ''}`} style={{ background: `conic-gradient(${gradient})`, transform: `rotate(${rotation}deg)` }}>
            {iconPositions.map((x) => (
              <span key={x.key} className={`wheel-icon ${x.key}`} style={{ transform: `rotate(${x.angle}deg) translateY(-74px) rotate(${-x.angle}deg)` }}>{icons[x.key]}</span>
            ))}
            <div className="wheel-hub">☠</div>
          </div>
        </div>
        <div className="prob-list">
          {resultOrder.map((key) => <div key={key} className={`prob ${key} ${result===key?'picked':''}`}><span>{icons[key]} {RESULT_META[key].label}</span><b>{weights[key]}%</b></div>)}
        </div>
      </div>
      {result && <div className={`roulette-result ${result}`}>결과: {icons[result]} {RESULT_META[result].label}</div>}
      {active && (
        <button className="stop-btn" disabled={disabled} onClick={spinning ? stop : start}>{spinning ? '멈추기!' : '룰렛 돌리기'}</button>
      )}
      {!active && auto && <div className="auto-note">자동 판정 대기</div>}
    </div>
  );
}
