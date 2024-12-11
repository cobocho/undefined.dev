/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        outline: '#1c1c1c',
        background: '#ffffff',
        border: '#e1e1e1',
        content: '#1c1c1c',
      },
      width: {
        'content-limit': '800px',
        toc: '260px',
      },
      screens: {
        desktop: {
          min: '1280px',
        },
        tablet: {
          max: '1279px',
          min: '800px',
        },
        mobile: {
          max: '799px',
        },
      },
      boxShadow: {
        inner: '',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
export default config
