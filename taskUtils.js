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
