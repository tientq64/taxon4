export function checkIsDevEnv(): boolean {
	return import.meta.env.DEV
}
