import { defineConfig } from 'vite'
import vitePluginReact from '@vitejs/plugin-react'

export default defineConfig({
	server: {
		port: 5500
	},
	plugins: [vitePluginReact()]
})
