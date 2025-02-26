/**
 * Mở URL trong tab mới.
 *
 * @param url URL cần mở.
 */
export function openUrl(url?: string): void {
	if (!url) return
	window.open(url, '_blank')
}
