/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                sidebar: "300px auto",
                "sidebar-collapsed": "64px auto", //for collapsed sidebar layout
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
                tb: ["Plus Jakarta Sans", "sans-serif"],
                tbLex: ["Lexend", "sans-serif"],
                tbPop: ["Poppins", "sans-serif"],
                tbMon: ["Montserrat", "sans-serif"],
                procSans: ["Prociono", "sans-serif"],
            },
            backgroundColor: {
                primary: "#f97316",
                "primary-light": "#ffedd5",
                "base-bg": "#fff7ed",
                "light-pg": "#F1F5F9",
                slate1: "#FEF8EF",
                "custom-bg": "#FFF5EE",
            },
            colors: {
                primary: "#f97316",
                "primary-light": "#ffedd5",
                "base-bg": "#fff7ed",
                "light-pg": "#F1F5F9",
                slate1: "#FEF8EF",
                "base-font": "#62748E",
                "custom-bg": "#FFF5EE",
            },
            backgroundImage: {
                "gradient-orange": "linear-gradient(to right, #fb923c, #ef4444)",
                "light-gradient-orange": "linear-gradient(to right, #EB5E3A, #FA944D, #FF3F3F)",
                "text-gradient-orange": "linear-gradient(to bottom, #EB5E3A, #FA944D, #FF3F3F, #EB5E3A)",
                "button-gradient-orange": "linear-gradient(to right, #FBBF24, #FB923C, #F43F5E)",
                "button-vertical-gradient-orange": "linear-gradient(to bottom, #FBBF24, #FB923C, #F43F5E)",
            },
        },
    },
    plugins: [],
};
