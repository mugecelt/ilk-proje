// addTask fonksiyonunun kullandığı görev metni doğrulamasını test eder
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidTaskText, normalizeCategory, DEFAULT_CATEGORY, getAuthErrorMessage } from './taskUtils.js';

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

test('bilinen auth hata kodu Türkçe mesaja çevrilir', () => {
  assert.equal(getAuthErrorMessage('auth/email-already-in-use'), 'Bu e-posta adresi zaten kayıtlı.');
  assert.equal(getAuthErrorMessage('auth/weak-password'), 'Şifre en az 6 karakter olmalı.');
  assert.equal(getAuthErrorMessage('auth/invalid-email'), 'Geçersiz e-posta adresi.');
});

test('bilinmeyen auth hata kodu genel mesaj döner', () => {
  assert.equal(getAuthErrorMessage('auth/some-unknown-code'), 'Bir hata oluştu, lütfen tekrar deneyin.');
  assert.equal(getAuthErrorMessage(undefined), 'Bir hata oluştu, lütfen tekrar deneyin.');
});
