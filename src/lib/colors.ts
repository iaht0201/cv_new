/**
 * 🎨 SINGLE SOURCE OF TRUTH – Chỉ đổi tại đây, toàn bộ app tự cập nhật
 *
 * Palette hiện tại: 2026 Trend – Mocha Mousse + Terracotta + Warm Cream
 * Tham khảo: Pantone 17-1230 "Mocha Mousse" (Color of the Year 2025)
 *
 * Để đổi theme: chỉ cần thay các hex values bên dưới và lưu file.
 */
export const colors = {
  // --- Accent ---
  accent:       '#A07850',  // 🟤 Mocha Mousse – màu nhận diện chính
  accentDeep:   '#7A5C38',  // Mocha đậm – dùng cho gradient tối
  accentWarm:   '#C4622D',  // 🟠 Terracotta – accent phối
  accentLight:  '#D4A574',  // 🍑 Caramel sáng – bullet, highlights nhẹ

  // --- Backgrounds ---
  background:   '#FAF7F2',  // 🤍 Warm Cream – nền tổng thể
  surface:      '#F3EDE4',  // Warm Surface – card background nhẹ
  surfaceMid:   '#E8DDD0',  // Border / divider

  // --- Text ---
  foreground:   '#1C1410',  // ⬛ Warm Charcoal – text chính (không phải đen lạnh)
  muted:        '#8A7060',  // Text phụ / placeholder / label
} as const;

export type ThemeColors = typeof colors;
