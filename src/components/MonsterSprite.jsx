import React, { useState } from 'react';
import { getMonsterRenderConfig } from '../data/monsterRenderConfig.js';

export default function MonsterSprite({ monster, state = 'idle', className = '' }) {
  const [failed, setFailed] = useState(false);
  const cfg = getMonsterRenderConfig(monster?.name);
  const file = monster?.file;
  const hasImage = file && !failed;

  const stageStyle = {
    '--monster-scale': cfg.scale ?? 0.74,
    '--monster-offset-x': `${cfg.offsetX ?? 0}px`,
    '--monster-offset-y': `${cfg.offsetY ?? -24}px`,
    '--monster-shadow-scale-x': cfg.shadowScaleX ?? 0.84,
    '--monster-shadow-scale-y': cfg.shadowScaleY ?? 0.78,
    '--monster-shadow-offset-x': `${cfg.shadowOffsetX ?? 0}px`,
    '--monster-shadow-offset-y': `${cfg.shadowOffsetY ?? -6}px`
  };

  return (
    <div className={`monster-stage monster-stage-${state} ${className}`} style={stageStyle}>
      <div className="monster-shadow" aria-hidden="true" />
      <div className="monster-sprite-wrap monster-body-v3">
        {hasImage ? (
          <img
            className="monster-sprite"
            src={file}
            alt={monster.name}
            draggable="false"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="monster-fallback">👾</span>
        )}
      </div>
    </div>
  );
}
