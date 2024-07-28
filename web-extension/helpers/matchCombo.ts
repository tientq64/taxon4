/**
 * So khớp combo phím sử dụng một mẫu so khớp.
 *
 * - `*` sẽ khớp với một phím bất kỳ.
 * - `(a|b)` sẽ khớp với phím `a` hoặc `b`.
 * - `, ` dùng để phân tách các mẫu so khớp với nhau. Lưu ý phải có ít nhất một khoảng trắng sau dấu cách, để phân biệt với phím `,`.
 *
 * @param comboPattern Mẫu combo phím cần so khớp.
 */
export function matchCombo(comboPattern: string, combo: string): boolean {
	const regexText: string = comboPattern
		.replace(/[\\+]/g, '\\$&')
		.replace(/, +/g, '|')
		.replace(/\*/g, "(?:[a-zA-Z0-9]+|[-`=[\\];'\\\\,./])")
	const regex: RegExp = RegExp(`^(?:${regexText})$`)
	return regex.test(combo)
}
