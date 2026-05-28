import React from 'react';
import SpritePlayer from './SpritePlayer.jsx';

export default function EffectPlayer({ src, playKey, className = '', scale = 1, onDone, fps = 14 }) {
  if (!src) return null;
  return (
    <div className={`effect-shell ${className}`}>
      <SpritePlayer
        key={`${src}-${playKey}`}
        src={src}
        playing
        loop={false}
        fps={fps}
        scale={scale}
        className="effect-sprite"
        safeCrop={false}
        onDone={onDone}
      />
    </div>
  );
}
