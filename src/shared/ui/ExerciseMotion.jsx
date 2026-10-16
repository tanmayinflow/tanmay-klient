import React, { useEffect, useRef, useState } from 'react';
import { exerciseMotionFor, claimMotionPlayer, releaseMotionPlayer } from '../product/exerciseMotion.js';
import './exerciseMotion.css';

export function ExerciseMotion({ exercise, theme, L }) {
  const motion = exerciseMotionFor(exercise);
  return motion ? <MotionPlayer key={motion.src} motion={motion} theme={theme} L={L} /> : null;
}

function MotionPlayer({ motion, theme, L }) {
  const videoRef = useRef(null);
  const regionRef = useRef(null);
  const intentRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const pause = () => { intentRef.current += 1; videoRef.current?.pause(); };
  useEffect(() => {
    const video = videoRef.current;
    const stop = () => { intentRef.current += 1; video.pause(); };
    const onHidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', stop);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) stop();
    });
    observer?.observe(regionRef.current);
    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', stop);
      releaseMotionPlayer(video);
      video.removeAttribute('src');
      video.load();
    };
  }, []);
  async function play() {
    const video = videoRef.current;
    if (!video.paused) { pause(); return; }
    const intent = ++intentRef.current;
    setOpen(true);
    setError(false);
    claimMotionPlayer(video);
    // Assign and play in the tap handler: iOS keeps the user activation.
    if (!video.getAttribute('src')) video.src = motion.src;
    video.playbackRate = speed;
    try {
      await video.play();
      if (intent !== intentRef.current || document.hidden) video.pause();
    } catch (failure) {
      if (intent === intentRef.current && failure.name !== 'AbortError') setError(true);
    }
  }
  function close() {
    pause();
    const video = videoRef.current;
    releaseMotionPlayer(video);
    video.removeAttribute('src');
    video.load();
    setOpen(false);
    setTime(0);
    setDuration(0);
    setError(false);
  }
  const colors = { '--motion-ink': theme.text, '--motion-muted': theme.textMuted,
    '--motion-accent': theme.sand, '--motion-rule': theme.border, '--motion-field': theme.bg };
  return <section ref={regionRef} className="tm-exercise-motion" data-dark={theme.mode === 'dark'} style={colors} aria-label={L('Pohyb cviku', 'Exercise movement')}>
    {!open && <button type="button" className="tm-motion-launch" onClick={play} aria-expanded={false}>▷ {L('Přehrát pohyb', 'Play movement')}</button>}
    <div hidden={!open}>
      <div className="tm-motion-heading"><span>{L('Pohyb cviku', 'Exercise movement')}</span><button type="button" onClick={close} aria-label={L('Zavřít pohybovou ukázku', 'Close movement demonstration')}>×</button></div>
      <video ref={videoRef} preload="none" playsInline muted loop aria-label={L('Kreslené provedení cviku', 'Illustrated exercise movement')}
        poster={open ? motion.poster : undefined}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onLoadedMetadata={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onError={() => { if (videoRef.current?.getAttribute('src')) setError(true); }} />
      <div className="tm-motion-controls">
        <button type="button" onClick={play}>{playing ? L('Pozastavit', 'Pause') : L('Přehrát', 'Play')}</button>
        <div role="group" aria-label={L('Rychlost přehrávání', 'Playback speed')}>
          {[0.5, 1].map(value => <button key={value} type="button" aria-pressed={speed === value} onClick={() => { setSpeed(value); videoRef.current.playbackRate = value; }}>{value === 0.5 ? '0.5×' : '1×'}</button>)}
        </div>
      </div>
      <input type="range" min="0" max={duration || 1} step="0.01" value={Math.min(time, duration || 1)} disabled={!duration}
        aria-label={L('Poloha v pohybu', 'Movement position')} aria-valuetext={`${time.toFixed(1)} / ${duration.toFixed(1)} s`}
        onChange={event => { pause(); videoRef.current.currentTime = Number(event.target.value); setTime(Number(event.target.value)); }} />
      {motion.oneSide && <p>{L('Ukázka jedné strany. Při cvičení strany vystřídej.', 'One side is shown. Alternate sides when exercising.')}</p>}
      {error && <p role="status">{L('Pohyb se nepodařilo načíst. Zkus ho přehrát znovu po připojení.', 'The movement could not load. Reconnect and try playing it again.')}</p>}
    </div>
  </section>;
}
