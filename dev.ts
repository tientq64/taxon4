import { FSWatcher, readFileSync, writeFileSync } from 'fs'
import GlobWatcher from 'glob-watcher'
import { join } from 'path'
import { build } from 'vite'

function joinPath(...paths: string[]): string {
	return join(...paths).replaceAll('\\', '/')
}

const watcher: FSWatcher = GlobWatcher(['web-extension/**'], {
	events: ['change']
})
watcher.on('change', watch)
watch()

async function watch(): Promise<void> {
	try {
		await build({
			logLevel: 'error',
			build: {
				target: 'ESNext',
				lib: {
					entry: 'web-extension/extension.tsx',
					formats: ['iife'],
					fileName: (_, entryName) => `${entryName}.js`,
					name: 'taxon4'
				},
				outDir: 'dist-web-extension',
				emptyOutDir: false
			}
		})

		let meta: string = readFileSync('web-extension/extension.user.js', 'utf-8')
		meta = meta
			.replace(
				'{scriptURL}',
				`file:///${joinPath(__dirname, 'dist-web-extension/extension.js')}`
			)
			.replace(
				'{styleURL}',
				`file:///${joinPath(__dirname, 'dist-web-extension/extension.css')}`
			)
		writeFileSync('dist-web-extension/extension.user.js', meta)
	} catch (error: unknown) {
		console.error(error)
	}
}
