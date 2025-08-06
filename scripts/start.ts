import vitePluginTailwind from '@tailwindcss/vite'
import vitePluginReact from '@vitejs/plugin-react'
import { ChildProcess, exec } from 'child_process'
import { watch } from 'chokidar'
import { config } from 'dotenv'
import { context } from 'esbuild'
import esbuildPluginTailwind from 'esbuild-plugin-tailwindcss'
import {
	copyFileSync,
	cpSync,
	existsSync,
	readdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync
} from 'fs'
import { every } from 'lodash-es'
import { basename } from 'path'
import { format, resolveConfig } from 'prettier'
import { createServer, ViteDevServer } from 'vite'
import vitePluginHtml from 'vite-plugin-html-config'
import { parse } from 'yaml'
import { languages } from '../src/constants/languages'
import { getImportMetaEnvForEsbuild } from './getImportMetaEnvForEsbuild'
import { app } from './middleware'
import { vitePluginExpress } from './vitePluginExpress'
import { vitePluginHtmlConfig } from './vitePluginHtmlConfig'

config()

const rootPath: string = process.cwd().replace(/\\/g, '/')
let proc: ChildProcess | null = null

cpSync('public/data/parts', 'backups/parts', { recursive: true })
copyFileSync('public/data/data.taxon4', 'backups/data.taxon4')
console.log('Đã backup dữ liệu cục bộ vào thư mục /backups.')

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

function buildUserScript(): void {
	let meta: string = readFileSync('web-extension/meta.user.js', 'utf8')
	meta = meta
		.replace('{scriptURL}', `file:///${rootPath}/dist-web-extension/script.js`)
		.replace('{styleURL}', `file:///${rootPath}/dist-web-extension/script.css`)
	writeFileSync('dist-web-extension/meta.user.js', meta)
}
watch('web-extension/meta.user.js').on('change', buildUserScript)
buildUserScript()

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

async function buildVSCodeExtension(): Promise<void> {
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
}
watch('vscode-extension/**/*.{ts,json}').on('change', buildVSCodeExtension)

async function generateDataPartsPathTsFile(): Promise<void> {
	const filenames: string[] = readdirSync('public/data/parts')
	const names: string[] = filenames.map((filename) => basename(filename, '.taxon4'))
	const json: string = JSON.stringify(names)
	const rawCode: string = `export const dataPartNames: string[] = ${json}`
	const prettierConfig = await resolveConfig('.prettierrc')
	const code: string = await format(rawCode, {
		...prettierConfig,
		parser: 'typescript'
	})
	writeFileSync('src/constants/dataPartNames.ts', code)
}
watch('public/data/parts/*.taxon4')
	.on('add', generateDataPartsPathTsFile)
	.on('unlink', generateDataPartsPathTsFile)
generateDataPartsPathTsFile()

function generateTranslationJsonFile(): void {
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
}
watch('src/locales/translation.yaml').on('change', generateTranslationJsonFile)
generateTranslationJsonFile()

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

console.log('Dev server đang chạy:')
server.printUrls()
server.bindCLIShortcuts({ print: true })
