/**
 * Trả về văn bản đang được bôi đen.
 */
export function getSel(): string {
	const selection: Selection | null = getSelection()
	if (selection === null) return ''
	return selection.toString().trim()
}

/**
 * Xóa vùng văn bản được bôi đen nếu có.
 */
export function emptySel(): void {
	const selection: Selection | null = getSelection()
	if (selection === null) return
	selection.empty()
}
