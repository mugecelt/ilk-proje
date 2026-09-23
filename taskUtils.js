// Görev ekleme fonksiyonunun kullandığı doğrulama mantığı
// Boş veya sadece boşluklardan oluşan metinleri geçersiz sayar
export function isValidTaskText(text) {
  return text.trim().length > 0;
}
