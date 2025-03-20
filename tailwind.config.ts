import type { Config } from 'tailwindcss'

/**
 * This plugin adds each Tailwind color as a global CSS variable.
 * For example, the color "gray-200" will become the CSS variable "--gray-200".
 */
function addVariablesForColors({ addBase, theme }: any) {
  // Import the module using require() to avoid TypeScript errors
  const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default
  const allColors = flattenColorPalette(theme('colors'))
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  )

  addBase({
    ':root': newVars
  })
}

const config = {
  darkMode: ['class', 'class'], // using "class" (or you can use ['class'] if preferred)
  content: [
    // Original file content patterns:
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    // Additional patterns from the second file:
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      backgroundImage: {
        'span-bg': 'var(--span-bg)',
        'grid-pattern': 'url(/path/to/grid-pattern.png)',
        'grid-pattern-light': 'url(/path/to/grid-pattern-light.png)'
      },
      colors: {
        background: 'var(--background)',
        primary: {
          DEFAULT: 'var(--primary)'
        },
        'button-secondary': 'var(--button-secondary)',
        'button-text': 'var(--button-text)',
        'text-secondary': 'var(--text-secondary)',
        'background-secondary': 'var(--background-secondary)',
        secondary: 'var(--secondary)',
        button: 'var(--button)',
        selected: 'var(--selected)',
        dropdown: 'var(--dropdown)',
        dropdownHover: 'var(--dropdown-hover)',
        buttonSecondary: 'var(--button-secondary)'
      },
      fontFamily: {
        sans: [
          'var(--font-space-grotesk)',
          'var(--rubik)'
        ]
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1s linear infinite'
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: '0 0'
          },
          to: {
            backgroundPosition: '-200% 0'
          }
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate'), addVariablesForColors]
} satisfies Config

export default config
