/**
 * Chuyển ký tự đầu tiên của chuỗi thành chữ in hoa.
 * @param str Chuỗi bất kỳ.
 * @returns Chuỗi với ký tự đầu tiên là chữ in hoa.
 */
export function upperFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.substring(1)
}
