export function openUrl(url: string): void {
	if (!url) return
	window.open(url, '_blank')
}
