export function startCase(text: string): string {
	return text.replace(/(?<=^|\s)\S/, (s) => s.toUpperCase())
}

export function isStartCase(text: string): boolean {
	return text === startCase(text)
}
