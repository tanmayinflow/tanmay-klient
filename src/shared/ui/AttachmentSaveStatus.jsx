import React, { useEffect, useState } from 'react';
export function AttachmentSaveStatus({ attachment, t, lang = 'cs' }) {
  const [upload, setUpload] = useState({ id: attachment.id, sending: false, blocked: attachment.cloudBlock || '' });
  useEffect(() => {
    setUpload({ id: attachment.id, sending: false, blocked: attachment.r2 ? '' : attachment.cloudBlock || '' });
    const update = event => {
      if (event.detail?.id === attachment.id) setUpload(previous => ({
        id: attachment.id,
        sending: !!event.detail.sending,
        blocked: event.detail.sending ? '' : Object.hasOwn(event.detail, 'blocked') ? event.detail.blocked || '' : previous.id === attachment.id ? previous.blocked : attachment.cloudBlock || '',
      }));
    };
    window.addEventListener('tm-media-upload', update);
    return () => window.removeEventListener('tm-media-upload', update);
  }, [attachment.id, attachment.r2, attachment.cloudBlock]);
  if (!attachment.idb && !attachment.r2) return null;
  const L = (cs, en) => lang === 'en' ? en : cs;
  const sending = upload.id === attachment.id && upload.sending;
  const blocked = upload.id === attachment.id ? upload.blocked : attachment.cloudBlock;
  const limit = ['storage-capacity', 'storage-user-limit', 'storage-operations'].includes(blocked);
  return <span data-testid="attachment-save-status" role="status" style={{ display: 'block', color: t.textSec, fontFamily: 'var(--ff-body,sans-serif)', fontSize: 12, lineHeight: 1.5, overflowWrap: 'anywhere' }}>
    {attachment.r2 ? L('Uloženo na serveru', 'Saved on the server') : sending ? L('Odesílám… Kopie zůstává v zařízení.', 'Sending… A copy remains on this device.') : limit ? L('Jen v tomto zařízení. Odesílání zastavil serverový limit. Zkontroluj Nastavení → Data.', 'On this device only. A server limit stopped the upload. Check Settings → Data.') : blocked?.startsWith('storage-') ? L('Jen v tomto zařízení. Server odesílání pozastavil. Zkontroluj Nastavení → Data.', 'On this device only. The server paused the upload. Check Settings → Data.') : L('Jen v tomto zařízení. Čeká na odeslání.', 'On this device only. Waiting to send.')}
  </span>;
}
