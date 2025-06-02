const chars: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function numToRadix62(num: number): string {
	if (num === 0) return '0'

	let result = ''
	while (num > 0) {
		result = chars[num % chars.length] + result
		num = Math.floor(num / chars.length)
	}

	return result
}
