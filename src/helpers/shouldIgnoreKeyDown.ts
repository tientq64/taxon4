export function shouldIgnoreKeyDown(event: KeyboardEvent): boolean {
	return event.repeat || !!document.activeElement?.matches('input, textarea')
}
