import { Express } from 'express'
import { Plugin, ViteDevServer } from 'vite'

export function vitePluginExpress(app: Express): Plugin {
	return {
		name: 'express-plugin',
		configureServer(server: ViteDevServer) {
			server.middlewares.use(app)
		}
	}
}
