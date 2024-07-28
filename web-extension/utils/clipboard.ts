export async function copyText(text: string): Promise<void> {
	await navigator.clipboard.writeText(text)
}

export async function readCopiedText(): Promise<string> {
	const copiedText: string = await navigator.clipboard.readText()
	return copiedText
}
