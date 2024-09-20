export function lowerFirst(val: string): string {
	const str: string = String(val)
	return str.charAt(0).toLowerCase() + str.substring(1)
}
