const { format } = Intl.NumberFormat('en')

/**
 * Trả về chuỗi số được định dạng theo tiếng Anh.
 *
 * @example
 * 	formatNumber(1234.56) // '1,234.56'
 *
 * @param num Số cần định dạng.
 * @returns Chuỗi số đã được định dạng theo tiếng Anh.
 */
export function formatNumber(num: number): string {
	return format(num)
}
