import vitePluginTailwind from '@tailwindcss/vite'
import vitePluginReact from '@vitejs/plugin-react'
import { ChildProcess, exec } from 'child_process'
import cors from 'cors'
import { config } from 'dotenv'
import { context } from 'esbuild'
import esbuildPluginTailwind from 'esbuild-plugin-tailwindcss'
import express, { Express, Request } from 'express'
import { existsSync, FSWatcher, readFileSync, unlinkSync, writeFileSync } from 'fs'
import GlobWatcher from 'glob-watcher'
import { every } from 'lodash-es'
import fetch from 'node-fetch'
import { createServer, ViteDevServer } from 'vite'
import vitePluginHtml from 'vite-plugin-html-config'
import { parse } from 'yaml'
import { languages } from '../src/constants/languages'
import { getImportMetaEnvForEsbuild } from './getImportMetaEnvForEsbuild'
import { vitePluginExpress } from './vitePluginExpress'
import { vitePluginHtmlConfig } from './vitePluginHtmlConfig'

config()

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
	define: getImportMetaEnvForEsbuild(),
	plugins: [esbuildPluginTailwind()],
	write: true
})
await webExtBuilder.watch()

watch('web-extension/meta.user.js', true, () => {
	let meta: string = readFileSync('web-extension/meta.user.js', 'utf8')
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
	} catch (error) {
		console.error(error)
	}
})

watch('public/data/data.taxon4', false, () => {
	server.ws.send({ type: 'full-reload' })
})

watch('src/locales/translation.yaml', true, () => {
	try {
		const yaml: string = readFileSync('src/locales/translation.yaml', 'utf8')
		const translation = parse(yaml)

		const langs: string[] = languages.map((language) => language.code)
		const langFieldValueTypes: string[] = ['string', 'number']

		for (const lang of langs) {
			const json: string = JSON.stringify(translation, (_, val) => {
				const isLangField: boolean = every(val, (v, k) => {
					return langs.includes(k) && langFieldValueTypes.includes(typeof v)
				})
				if (isLangField) {
					return val[lang]
				}
				return val
			})
			writeFileSync(`public/locales/translations/${lang}.json`, json)
		}
	} catch (error) {
		console.error(error)
		return
	}
})

const app: Express = express()
app.use(cors())

app.get('/file/:encodedUrl', async (req: Request<{ encodedUrl: string }>, res): Promise<void> => {
	const url: string = Buffer.from(req.params.encodedUrl, 'base64').toString('utf8')
	try {
		const response = await fetch(url)
		if (!response.ok) {
			res.status(response.status).send(response.statusText)
			return
		}
		response.body?.pipe(res)
	} catch (error) {
		res.status(500).send(error)
	}
})

const server: ViteDevServer = await createServer({
	server: {
		port: 5500
	},
	plugins: [
		vitePluginHtml(vitePluginHtmlConfig),
		vitePluginReact(),
		vitePluginTailwind(),
		vitePluginExpress(app)
	]
})

await server.listen()
server.printUrls()
server.bindCLIShortcuts({ print: true })
