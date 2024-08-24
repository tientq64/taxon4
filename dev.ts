import { ChildProcess, exec } from 'child_process'
import { FSWatcher, outputFileSync, readFileSync } from 'fs-extra'
import GlobWatcher from 'glob-watcher'
import { ModuleKind, ScriptTarget, transpile } from 'typescript'
import { build, createServer, ViteDevServer } from 'vite'

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
			}
		})

		let meta: string = readFileSync('web-extension/meta.user.js', 'utf-8')
		meta = meta
			.replace('{scriptURL}', `file:///${rootPath}/dist-web-extension/script.js`)
			.replace('{styleURL}', `file:///${rootPath}/dist-web-extension/style.css`)
		outputFileSync('dist-web-extension/meta.user.js', meta)
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

const server: ViteDevServer = await createServer({
	server: {
		port: 5500
	}
})
await server.listen()
server.printUrls()
