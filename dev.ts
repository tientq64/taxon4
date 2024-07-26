import { ChildProcess, exec, execSync } from 'child_process'
import { copySync, FSWatcher, outputFileSync, readFileSync } from 'fs-extra'
import GlobWatcher from 'glob-watcher'
import { join } from 'path'
import { ModuleKind, ScriptTarget, transpile } from 'typescript'
import { build } from 'vite'

const extensionPath: string | undefined = process.env.VSCODE_EXTENSION_PATH
if (extensionPath === undefined) {
	throw Error('Không tìm thấy VSCODE_EXTENSION_PATH trong .env file.')
}
let proc: ChildProcess | null = null

function joinPath(...paths: string[]): string {
	return join(...paths).replaceAll('\\', '/')
}

function watch(
	globs: string | string[],
	callImmediatePathname: string | undefined,
	changeCb: (pathname: string | undefined) => void
): FSWatcher {
	const watcher: FSWatcher = GlobWatcher(globs, {
		events: ['change']
	})
	if (callImmediatePathname !== undefined) {
		changeCb(callImmediatePathname)
	}
	watcher.on('change', changeCb)
	return watcher
}

function copyFileToExtensionPath(pathname: string): void {
	if (extensionPath === undefined) return
	copySync(`vscode-extension/${pathname}`, `${extensionPath}/${pathname}`)
}

watch('web-extension/**', '', async () => {
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
				emptyOutDir: false,
				copyPublicDir: false
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
		outputFileSync('dist-web-extension/extension.user.js', meta)
	} catch (error: unknown) {
		console.error(error)
	}
})

watch('vscode-extension/**/*.{ts,json}', '', () => {
	try {
		const text: string = readFileSync('vscode-extension/extension.ts', 'utf-8')
		const code: string = transpile(text, {
			target: ScriptTarget.ESNext,
			module: ModuleKind.CommonJS
		})
		outputFileSync('vscode-extension/extension.js', code)

		if (proc) proc.kill()
		proc = exec('vsce pack -o taxon4.vsix && code --install-extension taxon4.vsix', {
			cwd: 'vscode-extension'
		})
	} catch (error: unknown) {
		console.error(error)
	}
})
