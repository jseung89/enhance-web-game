import React, { useEffect } from 'react';

export default function FloatingText({ type = 'light', text, target = 'monster', playKey, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 820);
    return () => clearTimeout(t);
  }, [playKey, onDone]);

  return <div className={`floating-text floating-text-${type} floating-text-${target}`}>{text}</div>;
}
