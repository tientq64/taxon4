/**
 * @type {import('tailwindcss').Config}
 */

import colors from 'tailwindcss/colors'

export default {
	content: [
		'./index.html',
		'./src/**/*.{tsx,ts}',
		'./web-extension/**/*.{tsx,ts}'
		//
	],
	theme: {
		colors: {
			...colors
			// zinc: {
			// 	'50': '#f3f2f6',
			// 	'100': '#e7e5ee',
			// 	'200': '#cfcadc',
			// 	'300': '#b8b0cb',
			// 	'400': '#a095b9',
			// 	'500': '#887ba8',
			// 	'600': '#6d6286',
			// 	'700': '#524a65',
			// 	'800': '#363143',
			// 	'900': '#1b1922',
			// 	'950': '#0d0a15'
			// }
		}
	},
	plugins: []
}
