/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                corp: {
                    bg: '#050505', // Deep absolute black/dark grey
                    surface: 'rgba(20, 20, 20, 0.4)', // Glassmorphic base
                    card: 'rgba(30, 30, 35, 0.6)',
                    border: 'rgba(255, 255, 255, 0.08)',
                    accent: '#8b5cf6', // Vibrant purple
                    'accent-light': '#c084fc',
                    success: '#10b981',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    text: '#f8fafc',
                    muted: '#94a3b8',
                },
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(139, 92, 246, 0.25)',
                'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
                glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            },
            animation: {
                'blob': 'blob 10s infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
