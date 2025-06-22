const charset: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function numToRadix62(num: number): string {
	if (num === 0) return '0'

	let result = ''
	while (num > 0) {
		result = charset[num % charset.length] + result
		num = Math.floor(num / charset.length)
	}

	return result
}
