export function getImportMetaEnvForEsbuild(): Record<string, string> {
	const define: Record<string, string> = {}

	for (const key in process.env) {
		if (/[^A-Z_]/.test(key)) continue
		define[`import.meta.env.${key}`] = JSON.stringify(process.env[key])
	}

	return define
}
