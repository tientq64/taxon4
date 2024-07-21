import { defineConfig } from 'vite'
import alins from 'vite-plugin-alins'

export default defineConfig({
	server: {
		port: 5500
	},
	plugins: [alins()]
})
