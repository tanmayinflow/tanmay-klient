// Reviewed MP4 clips are ink on a light matte. Convert the matte into real alpha
// instead of relying on native video compositing (not consistent in iOS PWAs).
export function tintMotionPixels(pixels, ink) {
  for (let i = 0; i < pixels.length; i += 4) {
    const light = pixels[i] * .2126 + pixels[i + 1] * .7152 + pixels[i + 2] * .0722;
    pixels[i + 3] *= Math.max(0, Math.min(1, (235 - light) / 215));
    pixels[i] = ink[0]; pixels[i + 1] = ink[1]; pixels[i + 2] = ink[2];
  }
  return pixels;
}

export function attachMotionCanvas(video, canvas, { color, poster, onError }) {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) { onError(); return () => {}; }
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const ink = context.getImageData(0, 0, 1, 1).data.slice(0, 3);
  context.clearRect(0, 0, canvas.width, canvas.height);
  let disposed = false, failed = false, callback = null, lastTime = -1;
  const nativeFrames = typeof video.requestVideoFrameCallback === 'function';
  function draw(source, width, height) {
    if (disposed || failed || !width || !height) return;
    // Bound mobile readback work; never scale a small source up for processing.
    const scale = Math.min(1, 480 / Math.max(width, height));
    const w = Math.round(width * scale), h = Math.round(height * scale);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    try {
      context.drawImage(source, 0, 0, w, h);
      const frame = context.getImageData(0, 0, w, h);
      tintMotionPixels(frame.data, ink);
      context.putImageData(frame, 0, 0);
    } catch {
      failed = true;
      stop();
      context.clearRect(0, 0, w, h);
      onError();
    }
  }
  function stop() {
    if (callback !== null) {
      if (nativeFrames) video.cancelVideoFrameCallback(callback);
      else cancelAnimationFrame(callback);
    }
    callback = null;
  }
  function frame() {
    callback = null;
    if (disposed || video.paused || video.ended || document.hidden) return;
    if (video.readyState >= 2 && video.currentTime !== lastTime) {
      lastTime = video.currentTime;
      draw(video, video.videoWidth, video.videoHeight);
    }
    schedule();
  }
  function schedule() {
    if (disposed || failed || callback !== null || video.paused || video.ended || document.hidden) return;
    callback = nativeFrames ? video.requestVideoFrameCallback(frame) : requestAnimationFrame(frame);
  }
  function still() { if (video.readyState >= 2) draw(video, video.videoWidth, video.videoHeight); }
  const image = new Image();
  image.onload = () => { if (video.readyState < 2) draw(image, image.naturalWidth, image.naturalHeight); };
  image.src = poster;
  video.addEventListener('playing', schedule);
  video.addEventListener('pause', stop);
  video.addEventListener('loadeddata', still);
  video.addEventListener('seeked', still);
  still(); schedule();
  return () => {
    disposed = true; stop(); image.onload = null;
    video.removeEventListener('playing', schedule);
    video.removeEventListener('pause', stop);
    video.removeEventListener('loadeddata', still);
    video.removeEventListener('seeked', still);
  };
}
