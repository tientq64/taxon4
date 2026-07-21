/** Trả về văn bản đang được bôi đen. */
export function getSel(): string {
	const selection = getSelection()
	if (!selection) return ''

	return selection.toString().trim()
}

/** Xóa vùng văn bản được bôi đen nếu có. */
export function emptySel(): void {
	const selection = getSelection()
	if (!selection) return

	selection.empty()
}
