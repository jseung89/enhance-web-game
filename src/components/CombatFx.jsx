import React, { useEffect } from 'react';

const DURATIONS = {
  miss: 720,
  light: 620,
  heavy: 760,
  special: 1120,
  victory: 900,
  defeat: 850
};

export default function CombatFx({ type = 'light', target = 'monster', playKey, onDone, className = '' }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), DURATIONS[type] || 720);
    return () => clearTimeout(t);
  }, [type, playKey, onDone]);

  const sparks = type === 'special' ? 8 : type === 'heavy' ? 6 : 3;
  const lines = type === 'special' ? 8 : type === 'heavy' ? 6 : 2;

  return (
    <div className={`combat-fx combat-fx-${type} combat-fx-target-${target} ${className}`} data-key={playKey}>
      {type !== 'miss' && <span className="combat-impact-star" />}
      {(type === 'heavy' || type === 'special') && <span className="combat-impact-burst" />}
      {(type === 'heavy' || type === 'special') && Array.from({ length: lines }).map((_, i) => <span key={`l-${i}`} className={`combat-shock-line line-${i + 1}`} />)}
      {(type === 'heavy' || type === 'special') && <span className="combat-hit-ring ring-1" />}
      {type === 'special' && <span className="combat-hit-ring ring-2" />}
      {type === 'special' && <span className="special-impact-flash" />}
      {Array.from({ length: sparks }).map((_, i) => <span key={`s-${i}`} className={`combat-spark spark-${i + 1}`} />)}
      {type === 'victory' && <span className="victory-star-cloud" />}
      {type === 'defeat' && <span className="defeat-smoke-cloud" />}
    </div>
  );
}
