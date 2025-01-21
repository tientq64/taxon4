export function startCase(text: string): string {
	return text.replace(/(?<=^|\s)\S/g, (ch) => ch.toUpperCase())
}

export function isStartCase(text: string): boolean {
	return text === startCase(text)
}
