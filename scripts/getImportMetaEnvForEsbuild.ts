/**
 * Trả về object chứa các biến env dùng để build với Esbuild, vì Esbuild không có
 * `import.meta.env` như Vite.
 *
 * @returns Một object chứa các cặp tên biến-giá trị. Dùng trong trường `define` khi build
 *   với Esbuild.
 */
export function getImportMetaEnvForEsbuild(): Record<string, string> {
	const define: Record<string, string> = {}

	for (const key in process.env) {
		if (/[^A-Z_]/.test(key)) continue
		define[`import.meta.env.${key}`] = JSON.stringify(process.env[key])
	}

	return define
}
