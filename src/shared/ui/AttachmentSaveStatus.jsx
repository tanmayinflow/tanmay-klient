import React, { useEffect, useState } from 'react';
export function AttachmentSaveStatus({ attachment, t, lang = 'cs' }) {
  const [sending, setSending] = useState(false);
  useEffect(() => {
    const update = event => { if (event.detail?.id === attachment.id) setSending(event.detail.sending); };
    window.addEventListener('tm-media-upload', update);
    return () => window.removeEventListener('tm-media-upload', update);
  }, [attachment.id]);
  if (!attachment.idb && !attachment.r2) return null;
  const L = (cs, en) => lang === 'en' ? en : cs;
  return <span data-testid="attachment-save-status" role="status" style={{ display: 'block', color: t.textSec, fontFamily: 'var(--ff-body,sans-serif)', fontSize: 12, lineHeight: 1.5, overflowWrap: 'anywhere' }}>
    {attachment.r2 ? L('Uloženo na serveru', 'Saved on the server') : sending ? L('Odesílám… Kopie zůstává v zařízení.', 'Sending… A copy remains on this device.') : L('Jen v tomto zařízení. Čeká na odeslání.', 'On this device only. Waiting to send.')}
  </span>;
}
