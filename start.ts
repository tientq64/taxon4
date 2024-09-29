import vitePluginReact from '@vitejs/plugin-react'
import { ChildProcess, exec } from 'child_process'
import { existsSync, FSWatcher, readFileSync, unlinkSync, writeFileSync } from 'fs'
import GlobWatcher from 'glob-watcher'
import { build, createServer, transformWithEsbuild, ViteDevServer } from 'vite'
import viteConfig from './vite.config'

const rootPath: string = __dirname.replace(/\\/g, '/')
let proc: ChildProcess | null = null

function watch(
	globs: string | string[],
	callImmediatePathname: string | undefined,
	changeCb: (pathname: string | undefined) => void
): void {
	const watcher: FSWatcher = GlobWatcher(globs, {
		events: ['change']
	})
	if (callImmediatePathname !== undefined) {
		changeCb(callImmediatePathname)
	}
	watcher.on('change', changeCb)
}

watch('web-extension/**', '', async () => {
	try {
		await build({
			logLevel: 'error',
			build: {
				target: 'ESNext',
				lib: {
					entry: 'web-extension/script.tsx',
					formats: ['iife'],
					fileName: (_, entryName) => `${entryName}.js`,
					name: 'taxon4'
				},
				outDir: 'dist-web-extension',
				copyPublicDir: false
			},
			define: {
				'process.env.NODE_ENV': '"production"'
			},
			plugins: [vitePluginReact()]
		})

		let meta: string = readFileSync('web-extension/meta.user.js', 'utf-8')
		meta = meta
			.replace('{scriptURL}', `file:///${rootPath}/dist-web-extension/script.js`)
			.replace('{styleURL}', `file:///${rootPath}/dist-web-extension/style.css`)
		writeFileSync('dist-web-extension/meta.user.js', meta)
	} catch (error: unknown) {
		console.error(error)
	}
})

watch('vscode-extension/**/*.{ts,json}', '', async () => {
	try {
		const text: string = readFileSync('vscode-extension/extension.ts', 'utf-8')
		await build({
			logLevel: 'error',
			build: {
				target: 'node20',
				lib: {
					entry: 'vscode-extension/extension.ts',
					formats: ['cjs'],
					fileName: (_, entryName) => `${entryName}.js`
				},
				rollupOptions: {
					external: ['vscode']
				},
				sourcemap: false,
				outDir: 'vscode-extension',
				emptyOutDir: false,
				copyPublicDir: false
			}
		})
		if (proc) {
			proc.kill()
		}
		if (existsSync('vscode-extension/taxon4.vsix')) {
			unlinkSync('vscode-extension/taxon4.vsix')
		}
		proc = exec('vsce pack -o taxon4.vsix && code --install-extension taxon4.vsix', {
			cwd: 'vscode-extension'
		})
	} catch (error: unknown) {
		console.error(error)
	}
})

watch('public/data/data.taxon4', undefined, () => {
	server.ws.send({ type: 'full-reload' })
})

const server: ViteDevServer = await createServer(viteConfig)
await server.listen()
server.printUrls()
server.bindCLIShortcuts({ print: true })
