import { PHOTO_MAX_BYTES } from './mediaLimits.js';
export { PHOTO_MAX_BYTES } from './mediaLimits.js';
const failure = (code, cause) => Object.assign(new Error(code), { code, cause });
const text = bytes => String.fromCharCode(...bytes);
const imageType = file => {
  const type = (file.type || '').toLowerCase();
  if (type && type !== 'application/octet-stream') return type;
  const ext = /\.([^.]+)$/.exec(file.name || '')?.[1]?.toLowerCase();
  return ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif', heic: 'image/heic', heif: 'image/heif' })[ext] || type;
};

// Canvas would silently discard animation. Inspect container flags before any
// decode; GIF always keeps its original even when it contains a single frame.
export async function isAnimatedImage(file) {
  const type = imageType(file);
  if (type === 'image/gif') return true;
  if (type === 'image/webp') {
    const head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
    return text(head.slice(12, 16)) === 'VP8X' && !!(head[20] & 2);
  }
  if (type === 'image/avif') {
    const head = text(new Uint8Array(await file.slice(0, 128).arrayBuffer()));
    return head.includes('avis');
  }
  if (type === 'image/png') {
    let at = 8;
    for (let i = 0; i < 10000 && at + 8 <= file.size; i++) {
      const header = new Uint8Array(await file.slice(at, at + 8).arrayBuffer());
      if (header.length !== 8) throw failure('image-invalid');
      const size = new DataView(header.buffer, header.byteOffset, header.byteLength).getUint32(0);
      const chunk = text(header.slice(4));
      if (chunk === 'acTL') return true;
      if (chunk === 'IDAT' || chunk === 'IEND') return false;
      at += size + 12;
    }
    throw failure('image-invalid');
  }
  return false;
}

async function decodeImage(file) {
  if (typeof globalThis.createImageBitmap === 'function') {
    try { return await globalThis.createImageBitmap(file, { imageOrientation: 'from-image' }); } catch {}
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), img = new Image();
    const finish = () => { clearTimeout(timer); URL.revokeObjectURL(url); };
    const timer = setTimeout(() => { finish(); img.src = ''; reject(failure('image-decode')); }, 30000);
    img.onload = () => { finish(); resolve(img); };
    img.onerror = () => { finish(); reject(failure('image-decode')); };
    img.src = url;
  });
}
async function encodeImage(image, { width, height, type, quality }) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw failure('image-encode');
    ctx.drawImage(image, 0, 0, width, height);
    return await new Promise((resolve, reject) => canvas.toBlob(blob => blob?.size ? resolve(blob) : reject(failure('image-encode')), type, quality));
  } finally { canvas.width = canvas.height = 0; }
}
const renamed = (name, type) => {
  const extension = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' }[type];
  return (name || 'photo').replace(/\.[^.]+$/, '') + '.' + extension;
};

/** Prepare new still photographs only. Saved originals are never rewritten. */
export async function compressPhoto(file, { maxSide = 0, maxBytes = PHOTO_MAX_BYTES, decode = decodeImage, encode = encodeImage } = {}) {
  if (!file || !imageType(file).startsWith('image/')) return file;
  if (imageType(file) !== file.type) file = new File([file], file.name || 'photo', { type: imageType(file), lastModified: file.lastModified ?? Date.now() });
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || !Number.isFinite(maxSide) || maxSide < 0) throw failure('image-options');
  const needsCompression = file.size > maxBytes;
  if (!needsCompression && !maxSide) return file;
  if (await isAnimatedImage(file)) {
    if (needsCompression) throw failure('image-animation-too-large');
    return file;
  }
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'].includes((file.type || '').toLowerCase())) {
    if (needsCompression) throw failure('image-format-too-large');
    return file;
  }
  let image;
  try {
    image = await decode(file);
    const originalWidth = image.width || image.naturalWidth, originalHeight = image.height || image.naturalHeight;
    if (!(originalWidth > 0 && originalHeight > 0)) throw failure('image-decode');
    let side = Math.min(maxSide || 2560, Math.max(originalWidth, originalHeight));
    if (!needsCompression && Math.max(originalWidth, originalHeight) <= side) return file;
    const type = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
    for (let pass = 0; pass < 9; pass++) {
      const scale = Math.min(1, side / Math.max(originalWidth, originalHeight));
      const width = Math.max(1, Math.round(originalWidth * scale)), height = Math.max(1, Math.round(originalHeight * scale));
      for (const quality of [.9, .8, .68]) {
        const blob = await encode(image, { width, height, type, quality });
        if (!blob?.size || !['image/jpeg', 'image/webp', 'image/png'].includes(blob.type)) throw failure('image-encode');
        // Never replace a transparent-capable format with an opaque JPEG.
        if (type !== 'image/jpeg' && blob.type === 'image/jpeg') throw failure('image-alpha');
        if (blob.size <= maxBytes) {
          if (blob.size >= file.size) return file;
          return new File([blob], blob.type === file.type ? file.name || renamed('', blob.type) : renamed(file.name, blob.type), { type: blob.type, lastModified: file.lastModified ?? Date.now() });
        }
        if (blob.type === 'image/png') break;
      }
      side = Math.max(1, Math.floor(side * .75));
    }
    throw failure('image-compression-limit');
  } catch (error) { throw error?.code ? error : failure('image-decode', error); }
  finally { image?.close?.(); }
}
