/**
 * 🎨 Tailwind đồng bộ màu từ src/lib/colors.js
 * Để đổi theme: chỉ sửa src/lib/colors.ts (TS) – file .js này là bản copy để Tailwind đọc được
 *
 * NOTE: Tailwind config chỉ đọc được .js, không đọc .ts trực tiếp.
 * Vì vậy colors.js là bản mirror của colors.ts (đổi một thì nhớ đổi cả hai).
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─ Paste từ colors.ts vào đây khi đổi theme ─
        background:    '#FAF7F2',   // Warm Cream
        foreground:    '#1C1410',   // Warm Charcoal
        muted:         '#8A7060',   // Muted brown
        accent:        '#A07850',   // Mocha Mousse
        'accent-deep': '#7A5C38',   // Deep mocha
        'accent-warm': '#C4622D',   // Terracotta
        'accent-light':'#D4A574',   // Caramel
        surface:       '#F3EDE4',   // Warm surface
        // Tailwind utility classes: bg-surface-mid / border-surface-mid
        'surface-mid': '#E8DDD0',   // Mid-tone warm
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
