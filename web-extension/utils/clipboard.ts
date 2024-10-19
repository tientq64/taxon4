/**
 * Ghi văn bản vào clipboard.
 * @param text Văn bản cần ghi.
 */
export async function copyText(text: string): Promise<void> {
	await navigator.clipboard.writeText(text)
}

/**
 * Đọc văn bản từ clipboard.
 * @returns Văn bản trong clipboard.
 */
export async function readCopiedText(): Promise<string> {
	const copiedText: string = await navigator.clipboard.readText()
	return copiedText
}
