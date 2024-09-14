/**
 * Trả về văn bản đang được bôi đen.
 * @returns Văn bản đang được bôi đen.
 */
export function getSel(): string {
	const selection: Selection | null = getSelection()
	if (selection === null) return ''
	return selection.toString().trim()
}

export function emptySel(): void {
	const selection: Selection | null = getSelection()
	if (selection === null) return
	selection.empty()
}
