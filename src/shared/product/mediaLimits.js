// Decimal byte caps shared by the browser and server. No browser APIs here.
export const AUDIO_UPLOAD_BYTES = 15_000_000;
export const PHOTO_MAX_BYTES = 2_000_000;
export const ATTACHMENT_MAX_BYTES = 95 * 1024 * 1024;
export function mediaKind(type='', name='') {
  let filename=String(name || '');
  try { filename=decodeURIComponent(filename); } catch {}
  const mime=String(type || '').toLowerCase().split(';')[0].trim();
  if (mime.startsWith('image/') || /\.(jpe?g|png|webp|gif|avif|heic|heif|tiff?|bmp|svg)$/i.test(filename)) return 'image';
  if (mime.startsWith('audio/') || mime==='application/ogg' || /\.(mp3|m4a|aac|wav|ogg|oga|opus|webm|flac|aiff?|amr)$/i.test(filename)) return 'audio';
  return 'other';
}
export function mediaUploadLimit(type='',name='') {
  return {audio:AUDIO_UPLOAD_BYTES,image:PHOTO_MAX_BYTES,other:ATTACHMENT_MAX_BYTES}[mediaKind(type,name)];
}
export function audioPlaybackMime(type='',name='') {
  let filename=String(name||'');try{filename=decodeURIComponent(filename);}catch{}
  const mime=String(type||'').toLowerCase().split(';')[0].trim();
  if(mime==='application/ogg'||mime==='audio/opus'||(/\.(opus|ogg|oga)$/i.test(filename)&&mime!=='audio/ogg'))return 'audio/ogg';
  return type;
}
