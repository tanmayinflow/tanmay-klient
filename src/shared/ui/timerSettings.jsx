import React, { useEffect, useRef, useState } from 'react';
import { tmAudio, TM_SOUND_SETS } from '../../training/timerAudio.js';
import { tmVoice } from '../../training/timerVoice.js';
import { TM_VOICE_PICKS } from '../../training/timerVoicePicks.js';
import { FONT_BODY, FONT_TAG } from './type.js';

export function createTimerSettings({ useT, useStore, L, hexA, TChip, TmIcon }) {
  function useTmVoices() {
    const [voices, setVoices] = useState(() => tmVoice.voices());
    useEffect(() => tmVoice.onChange(setVoices), []);
    return voices;
  }
  function TmSoundSetPicker() {
    const { t } = useT(), st = useStore(), cfg = st.tmCfg();
    const [playing, setPlaying] = useState('');
    const timer = useRef(null);
    useEffect(() => () => { clearTimeout(timer.current); tmAudio.stopPreview(); }, []);
    const current = TM_SOUND_SETS.find(item => item.k === cfg.soundSet) || TM_SOUND_SETS[2];
    return <div data-timer-sounds="" style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: '1 1 280px', maxWidth: 520 }}>
      <span style={{ fontFamily: FONT_TAG, textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, color: t.sage }}>{L('Zvuková sada', 'Sound set')}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{TM_SOUND_SETS.map(item => <TChip key={item.k} label={(playing === item.k ? '♪ ' : '') + L(item.cz, item.en)} active={cfg.soundSet === item.k} onClick={() => {
        st.setTmCfg({ soundSet: item.k }); tmAudio.set(cfg.sound, cfg.volume, item.k); tmAudio.unlock();
        setPlaying(item.k); clearTimeout(timer.current);
        timer.current = setTimeout(() => setPlaying(''), tmAudio.preview(item.k) || 1500);
      }} />)}</div>
      <span style={{ fontFamily: FONT_BODY, fontSize: 12, fontStyle: 'italic', color: t.textMuted, lineHeight: 1.5 }}>{L(current.dcz, current.den)} {L('Klepnutím se sada vybere a přehraje ukázka.', 'Tap to select the set and hear a sample.')}</span>
    </div>;
  }
  function TmVoicePicker() {
    const { t } = useT(), st = useStore(), cfg = st.tmCfg(), voices = useTmVoices();
    const [playing, setPlaying] = useState('');
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    const selected = cfg.voiceEn || '', active = tmVoice.current(selected), automatic = tmVoice.current('');
    const sample = "Three. Two. One. Go. Last round. That's it, good work.";
    const picks = TM_VOICE_PICKS.map(pick => ({ pick, voice: voices.find(voice => pick.test.test(voice.name)) })).filter(item => item.voice);
    const picked = new Set(picks.map(item => item.voice.voiceURI)), rest = voices.filter(voice => !picked.has(voice.voiceURI));
    const select = uri => { st.setTmCfg({ voiceEn: uri }); tmVoice.set(cfg.voice, { rate: cfg.voiceRate, en: uri }); };
    const preview = voice => {
      if (!voice) return;
      tmVoice.set(cfg.voice, { rate: cfg.voiceRate, en: selected });
      tmVoice.audition(voice, sample); setPlaying(voice.voiceURI);
      clearTimeout(timer.current); timer.current = setTimeout(() => setPlaying(''), 5200);
    };
    const quiet = { background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 8, padding: '8px 10px', minHeight: 44, cursor: 'pointer', color: t.textSec, fontFamily: FONT_BODY, fontSize: 12 };
    const row = (voice, label, description) => {
      const chosen = selected ? selected === voice.voiceURI : active?.voiceURI === voice.voiceURI;
      return <div key={voice.voiceURI} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderTop: `1px solid ${t.borderSoft}` }}>
        <button aria-pressed={chosen} onClick={() => select(voice.voiceURI)} style={{ ...quiet, border: 'none', flex: 1, minWidth: 0, textAlign: 'left', padding: 0 }}>
          <span style={{ display: 'block', fontSize: 13, color: chosen ? t.accentInk || t.accent : t.text }}>{chosen ? '✓ ' : ''}{label}</span>
          {description && <span style={{ display: 'block', fontSize: 12, color: t.textMuted, lineHeight: 1.45 }}>{description}</span>}
        </button>
        <button data-tm-surface="control" data-tm-surface-active={playing === voice.voiceURI} aria-label={L('Poslechnout hlas', 'Preview voice') + ': ' + label} onClick={() => preview(voice)} style={{ ...quiet, flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, background: playing === voice.voiceURI ? hexA(t.accent, .12) : 'transparent' }}><TmIcon name="sound" size={13} />{L('Poslech', 'Hear')}</button>
      </div>;
    };
    return <div data-timer-voices="" style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0, flex: '1 1 320px', maxWidth: 520 }}>
      <span style={{ fontFamily: FONT_TAG, textTransform: 'uppercase', letterSpacing: '.14em', fontSize: 12, color: t.sage }}>{L('Hlas · angličtina', 'Voice · English')}</span>
      {!voices.length && <span role="status" style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, lineHeight: 1.55 }}>{L('Prohlížeč zatím nenabízí anglický hlas. Zvukové signály fungují i bez něj.', 'This browser has not provided an English voice. Sound cues still work without one.')}</span>}
      {picks.length > 0 && <div><div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, marginBottom: 4 }}>{L('Doporučené na tomto zařízení', 'Recommended on this device')}</div>{picks.map(({ pick, voice }) => row(voice, L(pick.cz, pick.en), L(pick.dcz, pick.den)))}</div>}
      <span style={{ fontFamily: FONT_BODY, fontSize: 12, fontStyle: 'italic', color: t.textMuted, lineHeight: 1.55 }}>{L('Na iPhonu si v Nastavení → Zpřístupnění → Čtení a mluvení → Hlasy můžeš stáhnout anglický hlas ve kvalitě Enhanced nebo Premium. Zde se ukážou hlasy, které prohlížeč zpřístupní.', 'On iPhone, download an Enhanced or Premium English voice in Settings → Accessibility → Read & Speak → Voices. This list shows the voices your browser makes available.')}</span>
      {rest.length > 0 && <details><summary style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, cursor: 'pointer', minHeight: 44, padding: '12px 0' }}>{L('Další anglické hlasy', 'More English voices')} · {rest.length}</summary>{rest.map(voice => row(voice, voice.name, voice.lang))}</details>}
      {voices.length > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button data-tm-surface="control" data-tm-surface-active={!selected} aria-pressed={!selected} onClick={() => select('')} style={{ ...quiet, textAlign: 'left', maxWidth: '100%', borderColor: selected ? t.border : t.accent, color: selected ? t.textSec : t.accentInk || t.accent }}>{L('Nejlepší dostupný', 'Best available')}{automatic ? ' · ' + automatic.name : ''}</button>
        <button data-tm-surface="control" data-tm-surface-active={!!playing} onClick={() => preview(active)} style={{ ...quiet, display: 'inline-flex', alignItems: 'center', gap: 7 }}><TmIcon name="sound" size={13} />{L('Poslechnout vybraný', 'Preview selected')}</button>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{L('Tempo', 'Pace')}<input aria-label={L('Tempo hlasu', 'Voice pace')} type="range" min="80" max="130" value={Math.round((cfg.voiceRate || 1) * 100)} onChange={event => st.setTmCfg({ voiceRate: Number(event.target.value) / 100 })} style={{ width: 110, accentColor: 'var(--tm-accent)' }} /></label>
      </div>}
    </div>;
  }
  return { TmSoundSetPicker, TmVoicePicker, useTmVoices };
}
