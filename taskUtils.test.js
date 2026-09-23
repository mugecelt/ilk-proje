// addTask fonksiyonunun kullandığı görev metni doğrulamasını test eder
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidTaskText } from './taskUtils.js';

test('boş görev metni geçersizdir', () => {
  assert.equal(isValidTaskText(''), false);
  assert.equal(isValidTaskText('   '), false);
});

test('dolu görev metni geçerlidir', () => {
  assert.equal(isValidTaskText('Süt al'), true);
});
