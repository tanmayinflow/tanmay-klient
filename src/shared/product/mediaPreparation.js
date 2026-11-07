import { prepareAudio } from './audioCompression.js';
import { preparePhotoAttachment } from './storageOverview.js';
import { mediaKind } from './mediaLimits.js';

export async function prepareNewAttachment(file, { preferences, current = () => true, onProgress, audio = prepareAudio, photo = preparePhotoAttachment } = {}) {
  const controller = new AbortController();
  const guard = () => { if (!current()) throw Object.assign(new Error('account-changed'), {code:'account-changed'}); };
  guard();
  const timer = setInterval(() => { if (!current()) controller.abort(); }, 250);
  try {
    const kind = mediaKind(file.type, file.name);
    const prepared = kind === 'audio' ? await audio(file, { signal: controller.signal, onProgress: value => { if (current()) onProgress?.(value); else controller.abort(); } })
      : kind === 'image' ? await photo(file, preferences) : file;
    guard(); return prepared;
  } catch (error) { guard(); throw error; }
  finally { clearInterval(timer); }
}

export function mediaPreparationMessage(error, name, L) {
  const code = error?.code || error?.message || '';
  if (code === 'audio-conversion-too-long' || code === 'audio-conversion-too-large') return L(`„${name}“ je pro automatický převod příliš dlouhý nebo velký. Převod zvládá nejvýše 30 minut a 100 MB. Rozděl soubor na kratší části. Původní soubor zůstal beze změny.`, `"${name}" exceeds automatic conversion limits of 30 minutes and 100 MB. Split it into shorter parts. The original file is unchanged.`);
  if (code.startsWith('audio-')) return L(`„${name}“ se nepodařilo převést do 15 MB. Vyber podporovaný zvukový soubor nebo kratší část. Původní soubor zůstal beze změny; rozpracovanou nahrávku můžeš stáhnout.`, `"${name}" could not be converted to fit 15 MB. Choose a supported audio file or a shorter part. The original is unchanged; an unfinished recording can still be downloaded.`);
  if (code === 'image-animation-too-large') return L(`„${name}“ je animace nad 2 MB. Aby zůstal zachovaný pohyb, zmenši ji před vložením. Původní soubor zůstal beze změny.`, `"${name}" is an animation over 2 MB. Reduce it before attaching to preserve its motion. The original file is unchanged.`);
  if (code.startsWith('image-')) return L(`„${name}“ se nepodařilo zmenšit do 2 MB. Vyber menší obrázek nebo fotografii JPEG. Původní soubor zůstal beze změny.`, `"${name}" could not be reduced to 2 MB. Choose a smaller image or a JPEG photo. The original file is unchanged.`);
  return L(`„${name}“ se nepodařilo uložit. Zkontroluj přihlášení, připojení a volné místo. Nahrávku nech otevřenou nebo ji stáhni.`, `"${name}" could not be saved. Check sign-in, connectivity and available space. Keep the recording open or download it.`);
}
