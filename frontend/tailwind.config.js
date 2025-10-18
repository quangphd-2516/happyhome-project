/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2C3E50',
                    light: '#34495E',
                    dark: '#1A252F',
                },
                accent: {
                    DEFAULT: '#E8D5C4',
                    light: '#F5EDE5',
                    dark: '#D4BCA8',
                },
                beige: {
                    50: '#FAF8F5',
                    100: '#F5EDE5',
                    200: '#E8D5C4',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}