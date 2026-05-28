import React, { useEffect, useMemo, useRef, useState } from 'react';

const BASE_FRAME_HEIGHT = 192;

function clampFrame(value, frameCount) {
  return Math.max(0, Math.min(frameCount - 1, value));
}

/**
 * Responsive 6-frame horizontal sprite renderer.
 *
 * The old game renderer assumed every weapon sheet was 1152x192
 * (6 x 192px square frames). New generated weapon sheets can be
 * much larger and can have non-square frames, so this component now:
 * - reads naturalWidth / naturalHeight from the image,
 * - calculates frameWidth = naturalWidth / frameCount,
 * - preserves the original frame aspect ratio,
 * - normalizes the visual height back to the old 192px baseline,
 * - applies scale/mirror/offset only on the outer wrapper.
 */
export default function SpritePlayer({
  src,
  frameCount = 6,
  frameWidth: legacyFrameWidth = 192,
  frameHeight: legacyFrameHeight = 192,
  fps = 10,
  playing = false,
  loop = false,
  scale = 1,
  mirrored = false,
  className = '',
  onDone,
  frame = null,
  safeCrop = true,
  cropLeft = 0,
  cropRight = 0,
  cropTop = 0,
  cropBottom = 0,
  offsetX = 0,
  offsetY = 0,
  idleRotation = 0,
  variant = 'default'
}) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [missing, setMissing] = useState(false);
  const [naturalSize, setNaturalSize] = useState(null);
  const timerRef = useRef(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    clearTimer();
    setMissing(false);
    setFrameIndex(0);
    setNaturalSize(null);

    if (!src) {
      setMissing(true);
      return clearTimer;
    }

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const naturalWidth = img.naturalWidth || legacyFrameWidth * frameCount;
      const naturalHeight = img.naturalHeight || legacyFrameHeight;
      if (!naturalWidth || !naturalHeight) {
        setMissing(true);
        return;
      }
      setNaturalSize({ naturalWidth, naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setMissing(true);
    };
    img.src = src;

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [src, frameCount, legacyFrameWidth, legacyFrameHeight]);

  const metrics = useMemo(() => {
    const naturalWidth = naturalSize?.naturalWidth || legacyFrameWidth * frameCount;
    const naturalHeight = naturalSize?.naturalHeight || legacyFrameHeight;
    const rawFrameWidth = naturalWidth / frameCount;
    const rawFrameHeight = naturalHeight;

    // Normalize every sheet to the previous visual baseline height.
    // This keeps high-res sheets from becoming huge while preserving ratio.
    const ratio = BASE_FRAME_HEIGHT / rawFrameHeight;
    const frameWidth = rawFrameWidth * ratio;
    const frameHeight = rawFrameHeight * ratio;
    const sheetWidth = naturalWidth * ratio;
    const sheetHeight = naturalHeight * ratio;

    const left = safeCrop ? Number(cropLeft || 0) : 0;
    const right = safeCrop ? Number(cropRight || 0) : 0;
    const top = safeCrop ? Number(cropTop || 0) : 0;
    const bottom = safeCrop ? Number(cropBottom || 0) : 0;

    return {
      frameWidth,
      frameHeight,
      sheetWidth,
      sheetHeight,
      cropLeft: Math.max(0, Math.min(frameWidth - 1, left)),
      cropRight: Math.max(0, Math.min(frameWidth - 1, right)),
      cropTop: Math.max(0, Math.min(frameHeight - 1, top)),
      cropBottom: Math.max(0, Math.min(frameHeight - 1, bottom))
    };
  }, [naturalSize, legacyFrameWidth, legacyFrameHeight, frameCount, safeCrop, cropLeft, cropRight, cropTop, cropBottom]);

  const visibleWidth = Math.max(1, metrics.frameWidth - metrics.cropLeft - metrics.cropRight);
  const visibleHeight = Math.max(1, metrics.frameHeight - metrics.cropTop - metrics.cropBottom);

  useEffect(() => {
    if (frame !== null && frame !== undefined) {
      setFrameIndex(clampFrame(frame, frameCount));
    }
  }, [frame, frameCount]);

  useEffect(() => {
    clearTimer();

    if (!playing) {
      if (frame === null || frame === undefined) setFrameIndex(0);
      return clearTimer;
    }

    setFrameIndex(0);
    const ms = Math.max(40, 1000 / fps);
    timerRef.current = setInterval(() => {
      setFrameIndex((prev) => {
        const next = prev + 1;
        if (next >= frameCount) {
          if (loop) return 0;
          clearTimer();
          setTimeout(() => {
            setFrameIndex(0);
            doneRef.current?.();
          }, 0);
          return frameCount - 1;
        }
        return next;
      });
    }, ms);

    return clearTimer;
  }, [playing, loop, fps, frameCount, src, frame]);

  const outerStyle = {
    width: `${visibleWidth}px`,
    height: `${visibleHeight}px`,
    transform: `translate(${offsetX}px, ${offsetY}px) rotate(${idleRotation}deg) ${mirrored ? 'scaleX(-1)' : ''} scale(${scale})`,
    transformOrigin: 'center center'
  };

  const viewportStyle = {
    width: `${visibleWidth}px`,
    height: `${visibleHeight}px`,
    backgroundImage: src && !missing ? `url(${src})` : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${metrics.sheetWidth}px ${metrics.sheetHeight}px`,
    backgroundPosition: `${-(frameIndex * metrics.frameWidth + metrics.cropLeft)}px ${-metrics.cropTop}px`
  };

  if (!src || missing) {
    return (
      <div className={`sprite-outer sprite-player sprite-variant-${variant} ${className}`} style={outerStyle}>
        <div className="sprite-viewport sprite-missing" style={{ width: visibleWidth, height: visibleHeight }}>
          asset<br />missing
        </div>
      </div>
    );
  }

  return (
    <div className={`sprite-outer sprite-player sprite-variant-${variant} ${className}`} style={outerStyle} aria-label="sprite">
      <div className="sprite-viewport sprite-bg" style={viewportStyle} />
    </div>
  );
}
