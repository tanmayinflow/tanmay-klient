import React, { useEffect, useRef, useState } from 'react';
import { exerciseMotionFor, claimMotionPlayer, releaseMotionPlayer } from '../product/exerciseMotion.js';
import './exerciseMotion.css';
import { attachMotionCanvas } from './motionInkFrame.js';

export function ExerciseMotion({ exercise, theme, L, autoPlay = false }) {
  const motion = exerciseMotionFor(exercise);
  return motion ? <MotionPlayer key={motion.src} motion={motion} theme={theme} L={L} autoPlay={autoPlay} /> : null;
}

export function motionMayAutoplay() {
  return typeof window !== 'undefined' && !document.hidden
    && document.documentElement.getAttribute('data-tm-motion') !== 'off'
    && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function MotionPlayer({ motion, theme, L, autoPlay }) {
  const videoRef = useRef(null);
  const regionRef = useRef(null);
  const canvasRef = useRef(null);
  const visible = useRef(false);
  const pending = useRef(false);
  const intentRef = useRef(0);
  const automatic = useRef(autoPlay && motionMayAutoplay());
  const startRef = useRef(null);
  const [open, setOpen] = useState(automatic.current);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const pause = () => { intentRef.current += 1; videoRef.current?.pause(); };
  useEffect(() => {
    if (!open) return;
    setRenderError(false);
    return attachMotionCanvas(videoRef.current, canvasRef.current, {
      color: theme.text, poster: motion.poster, onError: () => setRenderError(true),
    });
  }, [open, theme.text, motion.poster]);
  useEffect(() => {
    const video = videoRef.current;
    const stop = () => { intentRef.current += 1; video.pause(); };
    const onHidden = () => { if (document.hidden) stop(); else tryAutomatic(); };
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onReduced = () => { if (media?.matches) { automatic.current = false; stop(); } };
    const tryAutomatic = () => {
      if (!automatic.current || !visible.current || !motionMayAutoplay() || !video.paused || pending.current) return;
      startRef.current?.();
    };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', stop);
    media?.addEventListener?.('change', onReduced);
    video.addEventListener('loadeddata', tryAutomatic);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      visible.current = entries[0].isIntersecting;
      if (!visible.current) stop();
      else tryAutomatic();
    });
    observer?.observe(regionRef.current);
    if (!observer) { visible.current = true; tryAutomatic(); }
    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', stop);
      media?.removeEventListener?.('change', onReduced);
      video.removeEventListener('loadeddata', tryAutomatic);
      releaseMotionPlayer(video);
      video.removeAttribute('src');
      video.load();
    };
  }, []);
  async function start() {
    const video = videoRef.current;
    const intent = ++intentRef.current;
    pending.current = true;
    setOpen(true);
    setError(false);
    claimMotionPlayer(video);
    // Muted inline playback may start automatically. A denied browser policy
    // leaves the explicit Play control ready for a user gesture.
    if (!video.getAttribute('src')) video.src = motion.src;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.playbackRate = 1;
    try {
      await video.play();
      if (intent !== intentRef.current || document.hidden) video.pause();
    } catch (failure) {
      if (failure.name === 'NotAllowedError') automatic.current = false;
      if (intent === intentRef.current && !['AbortError', 'NotAllowedError'].includes(failure.name)) setError(true);
    } finally { pending.current = false; }
  }
  startRef.current = start;
  function play() {
    automatic.current = false;
    if (!videoRef.current.paused) pause();
    else start();
  }
  function close() {
    automatic.current = false;
    pause();
    const video = videoRef.current;
    releaseMotionPlayer(video);
    video.removeAttribute('src');
    video.load();
    setOpen(false);
    setError(false);
  }
  const colors = { '--motion-ink': theme.text, '--motion-muted': theme.textMuted,
    '--motion-accent': theme.sand, '--motion-rule': theme.border, '--motion-field': theme.bg };
  return <section ref={regionRef} className="tm-exercise-motion" data-dark={theme.mode === 'dark'} style={colors} aria-label={L('Pohyb cviku', 'Exercise movement')}>
    {!open && <button type="button" className="tm-motion-launch" onClick={play} aria-expanded={false}>▷ {L('Přehrát pohyb', 'Play movement')}</button>}
    <div hidden={!open}>
      <div className="tm-motion-heading"><span>{L('Pohyb cviku', 'Exercise movement')}</span><button type="button" onClick={close} aria-label={L('Zavřít pohybovou ukázku', 'Close movement demonstration')}>×</button></div>
      <div className="tm-motion-stage">
      <canvas ref={canvasRef} width="480" height="480" role="img" aria-label={L('Kreslené provedení cviku', 'Illustrated exercise movement')} />
      <video ref={videoRef} preload="none" playsInline muted loop autoPlay={open && automatic.current} aria-hidden="true" tabIndex={-1}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onError={() => { if (videoRef.current?.getAttribute('src')) setError(true); }} />
      </div>
      {!playing && <button type="button" className="tm-motion-launch" onClick={play}>{L('Přehrát pohyb', 'Play movement')}</button>}
      {motion.oneSide && <p>{L('Ukázka jedné strany. Při cvičení strany vystřídej.', 'One side is shown. Alternate sides when exercising.')}</p>}
      {error && <p role="status">{L('Pohyb se nepodařilo načíst. Zkus ho přehrát znovu po připojení.', 'The movement could not load. Reconnect and try playing it again.')}</p>}
      {renderError && <p role="status">{L('Ukázku se nepodařilo zobrazit. Zavři ji a otevři znovu.', 'The illustration could not be displayed. Close it and reopen it.')}</p>}
    </div>
  </section>;
}
