export function transcriptText(segments, { title = '', startedAt } = {}) {
  return [title, startedAt ? new Date(startedAt).toLocaleString() : '',
    ...(segments || []).map(row => `[${Math.floor(row.seconds / 60)}:${String(Math.floor(row.seconds % 60)).padStart(2, '0')}] ${row.text}`)].filter(Boolean).join('\n\n');
}

// Recognition is independent from the recorder: a service error never discards
// audio. Only final hypotheses are exported; no fabricated speaker attribution.
export function createConversationTranscriber({ Recognition, lang = 'cs-CZ', onSegment, onStatus,
  now = Date.now, delay = globalThis.setTimeout, clearDelay = globalThis.clearTimeout }) {
  let recognizer, active = false, retry, startedAt = 0, generation = 0, recordingLanguage;
  const run = token => {
    if (!active || token !== generation) return;
    try {
      recognizer = new Recognition();
      const current = recognizer;
      current.lang = recordingLanguage; current.continuous = true; current.interimResults = false;
      current.onresult = event => {
        if (token !== generation) return;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const text = String(event.results[i][0]?.transcript || '').trim();
            if (text) onSegment({ seconds: Math.max(0, (now() - startedAt) / 1000), text });
          }
        }
      };
      current.onstart = () => { if(token === generation) onStatus('listening'); };
      current.onerror = event => {
        if(token !== generation) return;
        if (['not-allowed','service-not-allowed','audio-capture','language-not-supported','network'].includes(event.error)) active = false;
        onStatus(event.error === 'no-speech' ? 'listening' : 'interrupted');
      };
      current.onend = () => {
        if (active && token === generation) retry = delay(() => run(token), 750);
      };
      current.start();
    } catch { active = false; onStatus('unavailable'); }
  };
  return {
    start(at = now()) { if (active) return; if (!Recognition) { onStatus('unavailable'); return; }
      recordingLanguage = typeof lang === 'function' ? lang() : lang;
      active = true; startedAt = at; run(++generation); },
    stop() { active = false; clearDelay(retry); try { recognizer?.stop(); } catch {} },
    dispose() { active = false; generation++; clearDelay(retry); try { recognizer?.abort(); } catch {} },
  };
}
