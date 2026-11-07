// Leave room for MediaRecorder's final container/chunk. Browsers may defer
// dataavailable in the background; the upload pipeline remains the hard cap.
export const RECORDING_STOP_BYTES = 14_500_000;
// Closing the editor preserves the account-scoped journal. Explicit cancel discards it.
export function createVoiceRecorder({ mediaDevices, Recorder, onState, onSave, onError,
  drafts, metadata = {}, audioBitsPerSecond = () => 64000, now = Date.now, id = () => 'rec' + crypto.randomUUID().replaceAll('-', ''),
  doc = globalThis.document, win = globalThis.window }) {
  let active = null, pending = false, disposed = false, generation = 0, failed = null;
  const tracks = stream => stream?.getTracks().forEach(track => track.stop());
  const emit = value => { if (!disposed) onState(value); };
  const checkpoint = () => { try { if (active?.rec.state === 'recording') active.rec.requestData?.(); } catch {} };
  doc?.addEventListener('visibilitychange', checkpoint); win?.addEventListener('pagehide', checkpoint);
  const warn = event => { if (active || pending || failed) { event.preventDefault(); event.returnValue = ''; } };
  win?.addEventListener('beforeunload', warn);
  async function start() {
    if (disposed || pending || active || failed) return;
    const attempt = ++generation; pending = true; emit({ phase: 'requesting' });
    let stream, draft, preparingStorage = false;
    try {
      if (!Recorder || !mediaDevices?.getUserMedia) throw new Error('unsupported');
      stream = await mediaDevices.getUserMedia({ audio: true });
      if (disposed || attempt !== generation) { tracks(stream); return; }
      const mimeType = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4'].find(type => Recorder.isTypeSupported?.(type));
      let rec;
      const requestedRate = typeof audioBitsPerSecond === 'function' ? audioBitsPerSecond() : audioBitsPerSecond;
      const bitRate = [32000, 64000, 128000].includes(requestedRate) ? requestedRate : 64000;
      try { rec = new Recorder(stream, { audioBitsPerSecond: bitRate, ...(mimeType ? { mimeType } : {}) }); }
      catch { rec = new Recorder(stream); }
      preparingStorage = true;
      if (drafts) draft = await drafts.create({ ...metadata, id: id(), type: rec.mimeType || mimeType || 'audio/webm' });
      if (disposed || attempt !== generation) { tracks(stream); if (draft) await drafts.remove(draft.id); return; }
      const session = { rec, stream, draft, cancelled: false, chunks: [], journal: Promise.resolve(), sequence: 0, checkpointFailed: false, bytes:0, limitReached:false };
      active = session;
      rec.ondataavailable = event => {
        if (!event.data?.size || session.cancelled) return;
        session.chunks.push(event.data);
        session.bytes += event.data.size;
        if (draft) {
          const sequence = session.sequence++;
          session.journal = session.journal.then(() => drafts.append(draft.id, sequence, event.data)).catch(() => {
            if (!session.checkpointFailed) {
              session.checkpointFailed = true; if (!disposed) onError('checkpoint');
              if (rec.state === 'recording') rec.stop();
            }
          });
        }
        if (!session.limitReached && session.bytes >= RECORDING_STOP_BYTES) {
          session.limitReached = true;
          emit({ phase:'saving', limitReached:true });
          if(rec.state!=='inactive')rec.stop();
        }
      };
      rec.onerror = () => { if (!disposed) onError('record'); if (rec.state === 'recording') rec.stop(); tracks(stream); };
      rec.onstop = async () => {
        tracks(stream); if (active === session) active = null;
        if (!session.cancelled && !disposed) pending = true;
        await session.journal;
        if (session.cancelled) { if (draft) await drafts.remove(draft.id).catch(() => {}); return; }
        if (disposed) return;
        pending = true; emit({ phase: 'saving' });
        const blob = new Blob(session.chunks, { type: rec.mimeType || 'audio/webm' });
        try {
          if (blob.size) await onSave(blob, draft);
          if (draft) await drafts.remove(draft.id);
        failed = null; emit(session.limitReached ? {phase:'limit',bytes:blob.size} : null);
        } catch { failed = { blob, draft }; emit({ phase: 'failed' }); onError('save'); }
        finally { pending = false; }
      };
      rec.start(1000); pending = false; emit({ phase: 'recording', startedAt: now() });
    } catch (error) {
      tracks(stream); if (draft) await drafts.remove(draft.id).catch(() => {});
      if (disposed || attempt !== generation) return;
      active = null; pending = false; emit(null);
      onError(error.message === 'unsupported' ? 'unsupported' : preparingStorage ? 'checkpoint' : 'permission');
    }
  }
  function stop() { if (active?.rec.state === 'recording') { emit({ phase: 'saving' }); active.rec.stop(); } }
  function cancel() {
    generation++; pending = false;
    if (active) {
      const session = active; session.cancelled = true;
      if (session.rec.state !== 'inactive') session.rec.stop();
      tracks(session.stream); active = null;
    }
    // Closing the failure notice keeps its durable recovery copy.
    failed = null; emit(null);
  }
  return {
    start, stop, cancel, failedBlob: () => failed?.blob || null,
    async retry() {
      if (!failed || pending) return;
      pending = true; emit({ phase: 'saving' }); const saved = failed;
      try { await onSave(saved.blob, saved.draft); if (saved.draft) await drafts.remove(saved.draft.id); failed = null; emit(null); }
      catch { emit({ phase: 'failed' }); onError('save'); }
      finally { pending = false; }
    },
    dispose() {
      disposed = true; generation++;
      checkpoint(); if (active?.rec.state === 'recording') active.rec.stop(); tracks(active?.stream);
      doc?.removeEventListener('visibilitychange', checkpoint); win?.removeEventListener('pagehide', checkpoint); win?.removeEventListener('beforeunload', warn);
    },
  };
}
