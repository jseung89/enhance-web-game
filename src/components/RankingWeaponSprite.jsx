import React, { useEffect, useMemo, useState } from 'react';

const FRAME_COUNT = 6;

const SIZE_PRESETS = {
  summary: { width: 168, height: 124 },
  top1: { width: 190, height: 150 },
  topCard: { width: 136, height: 112 },
  table: { width: 48, height: 38 },
  log: { width: 40, height: 34 },
  hall: { width: 96, height: 78 }
};

function getWeaponSrc(weapon) {
  return weapon?.spriteUrl || weapon?.imageUrl || weapon?.src || '';
}

export default function RankingWeaponSprite({ weapon, size = 'table', className = '' }) {
  const [naturalSize, setNaturalSize] = useState(null);
  const [missing, setMissing] = useState(false);
  const src = getWeaponSrc(weapon);
  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.table;

  useEffect(() => {
    setNaturalSize(null);
    setMissing(false);

    if (!src) {
      setMissing(true);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setMissing(true);
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  const metrics = useMemo(() => {
    const naturalWidth = naturalSize?.width || 1152;
    const naturalHeight = naturalSize?.height || 192;
    const frameWidth = naturalWidth / FRAME_COUNT;
    const frameHeight = naturalHeight;
    const fit = Math.min(preset.width / frameWidth, preset.height / frameHeight);
    const displayWidth = Math.max(1, frameWidth * fit);
    const displayHeight = Math.max(1, frameHeight * fit);

    return {
      frameWidth,
      frameHeight,
      displayWidth,
      displayHeight,
      sheetWidth: naturalWidth * fit,
      sheetHeight: naturalHeight * fit
    };
  }, [naturalSize, preset.width, preset.height]);

  if (!src || missing) {
    return (
      <span className={`ranking-weapon-sprite ranking-weapon-sprite-${size} ranking-weapon-sprite-missing ${className}`} aria-hidden="true">
        <span>{weapon?.icon || '⚔️'}</span>
      </span>
    );
  }

  return (
    <span
      className={`ranking-weapon-sprite ranking-weapon-sprite-${size} ${className}`}
      title={weapon?.name ? `+${weapon.enhancement ?? ''} ${weapon.name}` : '대표 무기'}
      aria-hidden="true"
    >
      <span
        className="ranking-weapon-sprite-frame"
        style={{
          width: `${metrics.displayWidth}px`,
          height: `${metrics.displayHeight}px`,
          backgroundImage: `url(${src})`,
          backgroundSize: `${metrics.sheetWidth}px ${metrics.sheetHeight}px`,
          backgroundPosition: '0px 0px'
        }}
      />
    </span>
  );
}
