// addTask fonksiyonunun kullandığı görev metni doğrulamasını test eder
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidTaskText, normalizeCategory, DEFAULT_CATEGORY } from './taskUtils.js';

test('boş görev metni geçersizdir', () => {
  assert.equal(isValidTaskText(''), false);
  assert.equal(isValidTaskText('   '), false);
});

test('dolu görev metni geçerlidir', () => {
  assert.equal(isValidTaskText('Süt al'), true);
});

test('kategori tanımsızsa varsayılan kategori döner', () => {
  assert.equal(normalizeCategory(undefined), DEFAULT_CATEGORY);
  assert.equal(normalizeCategory(''), DEFAULT_CATEGORY);
});

test('geçerli kategori olduğu gibi döner', () => {
  assert.equal(normalizeCategory('İş'), 'İş');
});

test('bilinmeyen kategori varsayılana döner', () => {
  assert.equal(normalizeCategory('Uydurma'), DEFAULT_CATEGORY);
});
