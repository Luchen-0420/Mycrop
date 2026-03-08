/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                corp: {
                    bg: '#0c0f1a',
                    surface: '#141829',
                    card: '#1a1f36',
                    border: '#2a2f4a',
                    accent: '#4f6ef7',
                    'accent-light': '#6b8aff',
                    success: '#22c55e',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    text: '#e2e8f0',
                    muted: '#64748b',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(79, 110, 247, 0.15)',
                'glow-lg': '0 0 40px rgba(79, 110, 247, 0.2)',
            },
        },
    },
    plugins: [],
}
