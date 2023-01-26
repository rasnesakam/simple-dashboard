/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

const backfaceVisibility = plugin(function ({ addUtilities }) {
	addUtilities({
		'.backface-visible': {
			'backface-visibility': 'visible',
		},
		'.backface-hidden': {
			'backface-visibility': 'hidden',
		}
	})
});

module.exports = {
  plugins: [backfaceVisibility],
  content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
		colors: {
			ground: "#E6E1C5",
			foreground: "#0F0F0F",
			primary: "",
			secondary: "",
			danger: "#DB324D",
			warning: "#E67F0D",
			success: "#21A179"
		}
	},
  },
  plugins: [],
}
