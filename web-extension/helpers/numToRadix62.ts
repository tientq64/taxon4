const charset: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * Chuyển một số nguyên sang chuỗi biểu diễn ở hệ cơ số 62 sử dụng bảng ký tự tùy biến.
 *
 * Bảng ký tự sử dụng gồm: 0–9, A–Z và a–z. Lưu ý: đây không phải chuẩn base62, thứ tự ký
 * tự là do hàm định nghĩa.
 *
 * @param num Số nguyên cần chuyển đổi.
 * @returns Chuỗi biểu diễn của số ở hệ cơ số 62.
 */
export function numToRadix62(num: number): string {
	if (num === 0) return '0'

	const isNegative = num < 0
	num = Math.abs(num)

	let result = ''
	while (num > 0) {
		result = charset[num % charset.length] + result
		num = Math.floor(num / charset.length)
	}

	return isNegative ? `-${result}` : result
}
