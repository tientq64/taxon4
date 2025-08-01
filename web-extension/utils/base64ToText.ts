export function base64ToText(base64: string): string {
	return atob(decodeURIComponent(base64))
}
