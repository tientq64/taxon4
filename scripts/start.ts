import vitePluginTailwind from '@tailwindcss/vite'
import vitePluginReact from '@vitejs/plugin-react'
import { ChildProcess, exec } from 'child_process'
import { context } from 'esbuild'
import esbuildPluginTailwind from 'esbuild-plugin-tailwindcss'
import { existsSync, FSWatcher, readFileSync, unlinkSync, writeFileSync } from 'fs'
import GlobWatcher from 'glob-watcher'
import { createServer, ViteDevServer } from 'vite'
import vitePluginHtml from 'vite-plugin-html-config'
import { vitePluginHtmlConfig } from './vitePluginHtmlConfig'

const rootPath: string = process.cwd().replace(/\\/g, '/')
let proc: ChildProcess | null = null

function watch(globs: string | string[], immediateCall: boolean, changeCb: () => void): void {
	const watcher: FSWatcher = GlobWatcher(globs, {
		events: ['change']
	})
	if (immediateCall) {
		changeCb()
	}
	watcher.on('change', changeCb)
}

const webExtBuilder = await context({
	entryPoints: ['web-extension/script.tsx'],
	bundle: true,
	minify: true,
	format: 'iife',
	outdir: 'dist-web-extension',
	logLevel: 'error',
	plugins: [esbuildPluginTailwind()],
	write: true
})
await webExtBuilder.watch()

watch('web-extension/meta.user.js', true, () => {
	let meta: string = readFileSync('web-extension/meta.user.js', 'utf-8')
	meta = meta
		.replace('{scriptURL}', `file:///${rootPath}/dist-web-extension/script.js`)
		.replace('{styleURL}', `file:///${rootPath}/dist-web-extension/script.css`)
	writeFileSync('dist-web-extension/meta.user.js', meta)
})

const vscodeExtBuilder = await context({
	entryPoints: ['vscode-extension/extension.ts'],
	bundle: true,
	minify: true,
	format: 'cjs',
	platform: 'node',
	target: 'node20',
	external: ['vscode'],
	outfile: 'vscode-extension/extension.js',
	logLevel: 'error',
	write: true
})

watch('vscode-extension/**/*.{ts,json}', false, async () => {
	try {
		proc?.kill()
		await vscodeExtBuilder.cancel()
		await vscodeExtBuilder.rebuild()
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

watch('public/data/data.taxon4', false, () => {
	server.ws.send({ type: 'full-reload' })
})

const server: ViteDevServer = await createServer({
	server: {
		port: 5500
	},
	plugins: [vitePluginHtml(vitePluginHtmlConfig), vitePluginReact(), vitePluginTailwind()]
})
await server.listen()
server.printUrls()
server.bindCLIShortcuts({ print: true })
