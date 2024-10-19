/**
 * Chuyển ký tự đầu tiên của chuỗi thành chữ in thường.
 * @param str Chuỗi bất kỳ.
 * @returns Chuỗi với ký tự đầu tiên là chữ in thường.
 */
export function lowerFirst(str: string): string {
	return str.charAt(0).toLowerCase() + str.substring(1)
}
