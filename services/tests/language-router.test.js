import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLanguage, resolveLanguage } from '../routing/language-router.js';

test('normalizes supported locale tags', () => {
  assert.equal(normalizeLanguage('bg-BG'), 'bg');
  assert.equal(normalizeLanguage('EN-us'), 'en');
  assert.equal(normalizeLanguage('xx'), null);
});

test('prefers explicit then cookie then Accept-Language', () => {
  assert.equal(resolveLanguage({ explicit: 'de', cookie: 'bg', acceptLanguage: 'fr' }), 'de');
  assert.equal(resolveLanguage({ cookie: 'bg', acceptLanguage: 'fr' }), 'bg');
  assert.equal(resolveLanguage({ acceptLanguage: 'fr-FR, en;q=0.8' }), 'fr');
  assert.equal(resolveLanguage({ acceptLanguage: 'xx, en;q=0.8' }), 'en');
});
