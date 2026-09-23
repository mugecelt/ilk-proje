// Görev ekleme fonksiyonunun kullandığı doğrulama mantığı
// Boş veya sadece boşluklardan oluşan metinleri geçersiz sayar
export function isValidTaskText(text) {
  return text.trim().length > 0;
}

// Uygulamada kullanılabilecek sabit kategori listesi
// Hem görev ekleme hem de filtreleme dropdown'ları bu listeyi kullanır
export const CATEGORIES = ['Genel', 'İş', 'Kişisel', 'Alışveriş'];

// Varsayılan kategori: seçim yapılmazsa veya eski görevlerde
// category alanı yoksa bu değer kullanılır
export const DEFAULT_CATEGORY = 'Genel';

// Eksik/bilinmeyen kategori değerlerini güvenli şekilde varsayılana çevirir
export function normalizeCategory(category) {
  if (!category || !CATEGORIES.includes(category)) {
    return DEFAULT_CATEGORY;
  }
  return category;
}

// Firebase Auth hata kodlarını kullanıcıya gösterilecek Türkçe mesajlara çevirir
const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Bu e-posta adresi zaten kayıtlı.',
  'auth/invalid-email': 'Geçersiz e-posta adresi.',
  'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
  'auth/wrong-password': 'E-posta veya şifre hatalı.',
  'auth/user-not-found': 'E-posta veya şifre hatalı.',
  'auth/invalid-credential': 'E-posta veya şifre hatalı.'
};

const DEFAULT_AUTH_ERROR_MESSAGE = 'Bir hata oluştu, lütfen tekrar deneyin.';

export function getAuthErrorMessage(code) {
  return AUTH_ERROR_MESSAGES[code] || DEFAULT_AUTH_ERROR_MESSAGE;
}
