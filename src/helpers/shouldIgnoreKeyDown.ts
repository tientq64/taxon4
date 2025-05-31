export function shouldIgnoreKeyDown(event: KeyboardEvent): boolean {
	if (event.repeat) return true

	if (document.activeElement === null) return false
	if (document.activeElement.matches('input, textarea')) return true

	return false
}
