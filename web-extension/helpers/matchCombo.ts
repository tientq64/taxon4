/**
 * So khớp chính xác combo phím sử dụng một mẫu so khớp.
 *
 * - `*` sẽ khớp với một phím bất kỳ.
 * - `**` sẽ khớp với một hoặc nhiều phím bất kỳ.
 * - `+` dùng để kết hợp các phím trong combo phím.
 * - `(a|b)` sẽ khớp với phím `a` hoặc `b`.
 * - `, ` dùng để phân tách các mẫu so khớp với nhau. Lưu ý phải có ít nhất một dấu cách sau
 *   dấu phẩy, để phân biệt với phím `,`.
 *
 * @example
 * 	matchCombo('ctrl+*', 'ctrl+m') // true
 * 	matchCombo('ctrl+*', 'ctrl') // false
 * 	matchCombo('ctrl+*', 'ctrl+shift+s') // false
 *
 * @param comboPattern Mẫu combo phím để so khớp.
 * @param combo Combo phím cần so khớp.
 */
export function matchCombo(comboPattern: string, combo: string): boolean {
	const regexText: string = comboPattern
		// Thoát các ký tự "\", "+".
		.replace(/[\\+]/g, '\\$&')

		// Phân tách các nhóm phím bởi dấu phẩy theo sau là dấu cách.
		.replace(/, +/g, ')$|^(?:')

		// Nhiều phím bất kỳ.
		.replace(
			/\*\*/g,
			"(?:[a-zA-Z0-9]+|[-`=[\\];'\\\\,./])(?:\\+(?:[a-zA-Z0-9]+|[-`=[\\];'\\\\,./])){0,}"
		)

		// Một phím bất kỳ.
		.replace(/\*/g, "(?:[a-zA-Z0-9]+|[-`=[\\];'\\\\,./])")

	const regex: RegExp = RegExp(`^(?:${regexText})$`)

	return regex.test(combo)
}
