export function textToBase64(text: string): string {
	return encodeURIComponent(btoa(text))
}
