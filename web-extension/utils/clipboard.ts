/**
 * Ghi văn bản vào clipboard.
 *
 * @param text Văn bản cần ghi.
 */
export function copyText(text: string): Promise<void> {
	return navigator.clipboard.writeText(text)
}

/**
 * Đọc văn bản từ clipboard.
 *
 * @returns Văn bản trong clipboard.
 */
export function readCopiedText(): Promise<string> {
	return navigator.clipboard.readText()
}
