import { GUIDE_EARTH_SURFACE } from './guideSurface.js';

// One original material and shadow for the guide and navigation chrome.
export const GUIDE_MATERIAL_BORDER = `url(${GUIDE_EARTH_SURFACE}) 120 140 120 80 fill / 24px 32px 24px 18px / 0 stretch`;
export const GUIDE_MATERIAL_SHADOW = 'drop-shadow(0 5px 6px rgba(28,28,26,.20)) drop-shadow(0 14px 22px rgba(28,28,26,.24))';
