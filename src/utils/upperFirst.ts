/**
 * Trả về chuỗi viết in hoa ký tự đầu tiên.
 */
export function upperFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
