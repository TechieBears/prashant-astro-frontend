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
                "separator": "#CAD5E2",
            },
            colors: {
                primary: "#f97316",
                "primary-orange": "#FF8835",
                "primary-light": "#ffedd5",
                "base-bg": "#fff7ed",
                "light-pg": "#F1F5F9",
                slate1: "#FEF8EF",
                "base-font": "#62748E",
                "custom-bg": "#FFF5EE",
                "orange-light": "#FFD8A4",
                "form-bg": "#F8FAFC",
            },
            backgroundImage: {
                "gradient-orange": "linear-gradient(to right, #fb923c, #fb923c, #ef4444)",
                "light-gradient-orange": "linear-gradient(to right, #EB5E3A, #FA944D, #FF3F3F)",
                "text-gradient-orange": "linear-gradient(to bottom, #EB5E3A, #FA944D, #FF3F3F, #EB5E3A)",
                "button-gradient-orange": "linear-gradient(to right, #FBBF24, #FB923C, #F43F5E)",
                "button-vertical-gradient-orange": "linear-gradient(to bottom, #FBBF24, #FB923C, #F43F5E)",
                "button-diagonal-gradient-orange": "linear-gradient(135deg, #FB923C 0%, #F43F5E 100%)",
                "light-orange": "#F7E8D4",
                "custom-linear": "linear-gradient(270deg, rgba(243, 51, 51, 0.15) 0%, rgba(250, 148, 77, 0.15) 50.61%, rgba(255, 186, 0, 0.15) 100%)",
            },
        },
    },
    plugins: [],
};
