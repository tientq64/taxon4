export function getSel(): string {
	const selObj: Selection | null = getSelection()
	if (selObj === null) return ''
	return selObj.toString().trim()
}
