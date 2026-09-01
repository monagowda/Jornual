/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: 'var(--paper-bg, #FAF6EE)',
          card: 'var(--paper-card, #FFFDF9)',
          border: 'var(--paper-border, #E8DFD1)',
          text: 'var(--paper-text, #2D2926)',
          muted: 'var(--paper-muted, #7C746B)',
          primary: 'var(--paper-primary, #C88D66)',
          accent: 'var(--paper-accent, #E0A96D)',
          secondary: 'var(--paper-secondary, #9B8272)',
        },
      },
      fontFamily: {
        handwritten: ['var(--font-handwritten)', 'Caveat', 'cursive'],
        handwritten2: ['var(--font-handwritten2)', 'Dancing Script', 'cursive'],
        handwritten3: ['var(--font-handwritten3)', 'Pacifico', 'cursive'],
        elegant: ['var(--font-elegant)', 'Playfair Display', 'serif'],
        elegant2: ['var(--font-elegant2)', 'Cormorant Garamond', 'serif'],
        modern: ['var(--font-modern)', 'Inter', 'sans-serif'],
        modern2: ['var(--font-modern2)', 'DM Sans', 'sans-serif'],
        typewriter: ['var(--font-typewriter)', 'Special Elite', 'monospace'],
      },
      boxShadow: {
        scrapbook: '0 4px 20px -2px rgba(45, 41, 38, 0.08), 0 2px 6px -1px rgba(45, 41, 38, 0.04)',
        polaroid: '0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
        lifted: '0 15px 35px -5px rgba(0, 0, 0, 0.15), 0 5px 15px -3px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))' },
          '50%': { transform: 'scale(1.08) rotate(1deg)', filter: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.6))' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        flame: 'flame 2s ease-in-out infinite',
        pop: 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
    },
  },
  plugins: [],
};
