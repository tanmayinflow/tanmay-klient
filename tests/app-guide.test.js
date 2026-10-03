import test from 'node:test';
import assert from 'node:assert/strict';
import { APP_GUIDE_STEPS, getGuideTours, visibleGuideRect, placeGuidePanel, guideArrow } from '../src/shared/product/appGuide.js';

test('client tour cannot expose coach rooms even when caller supplies all room ids', () => {
  const availableRooms = [...new Set(APP_GUIDE_STEPS.map(step => step.room))];
  const tours = getGuideTours({ role: 'client', availableRooms });
  for (const room of ['klienti', 'hospodareni', 'socsite', 'mandala']) assert.ok(!tours.some(tour => tour.room === room), room);
  assert.ok(tours.some(tour => tour.room === 'terminy'));
  assert.ok(!getGuideTours({ role: 'coach', availableRooms }).some(tour => tour.room === 'terminy'));
});

test('guide never enables absent optional rooms or expands a missing allowlist', () => {
  assert.deepEqual(getGuideTours(), []);
  const tours = getGuideTours({ role: 'client', availableRooms: ['praxe', 'trenink', 'kompas', 'nastaveni'] });
  assert.deepEqual(tours.map(tour => tour.room), ['praxe', 'trenink', 'kompas', 'nastaveni']);
  for (const room of ['spolu', 'denik', 'zapisnik', 'memento', 'prameny']) assert.ok(!tours.some(tour => tour.room === room));
  assert.ok(getGuideTours({ availableRooms: ['spolu'] }).some(tour => tour.room === 'spolu'));
});

test('step allowlist can omit unavailable account/calendar and empty-state actions', () => {
  const tours = getGuideTours({ role: 'client', availableRooms: ['nastaveni', 'denik'], availableSteps: ['nastaveni.account', 'nastaveni.version'] });
  assert.deepEqual(tours.map(tour => tour.room), ['nastaveni']);
  assert.deepEqual(tours[0].steps.map(step => step.id), ['nastaveni.account', 'nastaveni.version']);
  assert.deepEqual(getGuideTours({ availableRooms: ['praxe'], availableSteps: [] }), []);
});

test('room tours use unique explicit anchors, short bilingual copy and role-aware training/privacy copy', () => {
  assert.equal(new Set(APP_GUIDE_STEPS.map(step => step.id)).size, APP_GUIDE_STEPS.length);
  for (const step of APP_GUIDE_STEPS) {
    assert.match(step.anchor, /^[a-z]+\.[a-z]+$/);
    for (const field of ['title', 'body']) {
      assert.equal(step[field].length, 2);
      for (const text of step[field]) assert.ok(text.trim().length > 0 && text.length < 360, step.id);
    }
  }
  const client = getGuideTours({ role: 'client', availableRooms: ['trenink', 'denik'], lang: 'en' });
  assert.match(client.find(tour => tour.room === 'trenink').steps[0].body, /does not overwrite/);
  assert.match(client.find(tour => tour.room === 'denik').steps[1].body, /trainer cannot see/);
  const coach = getGuideTours({ role: 'coach', availableRooms: ['trenink'] })[0];
  assert.ok(!coach.steps[0].body.includes('Trenér připravuje'));
});

test('mobile card fits below target without covering it or the bottom navigation', () => {
  const viewport = { left: 0, top: 0, width: 402, height: 874 };
  const target = { left: 24, top: 110, right: 378, bottom: 230, width: 354, height: 120 };
  const panel = placeGuidePanel({ target, viewport, panelHeight: 260, insets: { top: 8, bottom: 86 } });
  assert.equal(panel.connected, true);
  assert.equal(panel.side, 'below');
  assert.ok(panel.top >= target.bottom + 16);
  assert.ok(panel.top + panel.maxHeight <= viewport.height - 86 - 12);
  assert.ok(panel.left >= 12 && panel.left + panel.width <= viewport.width - 12);
  const arrow = guideArrow(target, panel, 260);
  assert.equal(arrow.y2, target.bottom + 4);
});

test('target near viewport bottom puts card above; wide layout prefers free side', () => {
  const target = { left: 20, top: 650, right: 380, bottom: 720, width: 360, height: 70 };
  const mobile = placeGuidePanel({ target, viewport: { left: 0, top: 0, width: 402, height: 874 }, panelHeight: 230, insets: { bottom: 86 } });
  assert.equal(mobile.side, 'above');
  assert.ok(mobile.top + mobile.maxHeight < target.top);
  const desktop = placeGuidePanel({ target, viewport: { left: 0, top: 0, width: 1280, height: 900 }, panelHeight: 230 });
  assert.equal(desktop.side, 'right');
  assert.ok(desktop.left > target.right);
});

test('keyboard viewport offsets and clipped targets stay in actual visible coordinates', () => {
  const viewport = { left: 30, top: 120, width: 360, height: 420 };
  const clipped = visibleGuideRect({ left: 12, top: 80, width: 360, height: 110 }, viewport, { top: 10 });
  assert.deepEqual(clipped, { left: 30, top: 130, right: 372, bottom: 190, width: 342, height: 60 });
  const panel = placeGuidePanel({ target: clipped, viewport, panelHeight: 180 });
  assert.equal(panel.connected, true);
  assert.ok(panel.left >= 42 && panel.top >= 132);
  assert.ok(panel.left + panel.width <= 378 && panel.top + panel.maxHeight <= 528);
  assert.equal(visibleGuideRect({ left: 0, top: 0, width: 300, height: 20 }, viewport), null);
});

test('an oversized target or missing target produces no misleading arrow', () => {
  const viewport = { left: 0, top: 0, width: 320, height: 480 };
  const target = { left: 10, top: 10, right: 310, bottom: 470, width: 300, height: 460 };
  const panel = placeGuidePanel({ target, viewport, panelHeight: 220 });
  assert.equal(panel.connected, false);
  assert.equal(guideArrow(target, panel, 220), null);
  assert.equal(placeGuidePanel({ target: null, viewport }).connected, false);
  assert.equal(visibleGuideRect({ left: 10, top: 10, width: 0, height: 20 }, viewport), null);
});
