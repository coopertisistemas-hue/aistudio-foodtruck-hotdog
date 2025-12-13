/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#ec4913",
                "primary-light": "#fef3ee",
                "background-light": "#f8f6f6",
                "background-dark": "#221510",
                "card-light": "#ffffff",
                "card-dark": "#2a1a14",
                "text-primary-light": "#1b110d",
                "text-primary-dark": "#f8f6f6",
                "text-secondary-light": "#9a5f4c",
                "text-secondary-dark": "#a88e86",
            },
            fontFamily: {
                display: ["Plus Jakarta Sans", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
                full: "9999px",
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
