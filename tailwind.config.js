/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand purple — used sparingly per spec: primary actions, selected
        // nav state, brand accents. Never a full-screen wash.
        brand: {
          50: '#F5F1FC',
          100: '#EBE3F9',
          200: '#D2C0F0',
          400: '#9466DE',
          500: '#7A46D2',
          600: '#6633C2',
          700: '#5427A3',
          900: '#2E1660'
        },
        // Secondary green — success, availability, verified, price highlights.
        confirm: {
          50: '#EAF9F1',
          100: '#CFF1DF',
          500: '#1F9D63',
          600: '#188053'
        },
        ink: {
          900: '#16141C',
          700: '#3A3644',
          500: '#6E6A78',
          300: '#A7A3B1',
          100: '#E9E7EE'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#FAF9FC',
          line: '#E8E5EF'
        }
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 20, 28, 0.06), 0 1px 1px rgba(22, 20, 28, 0.04)',
        raised: '0 4px 16px rgba(22, 20, 28, 0.08)'
      },
      borderRadius: {
        card: '14px',
        control: '10px'
      }
    }
  },
  plugins: []
}
