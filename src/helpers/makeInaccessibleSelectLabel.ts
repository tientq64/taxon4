export function makeInaccessibleSelectLabel(selectLabel: string): string {
	return '\u200c' + selectLabel
}
