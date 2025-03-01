/**
 * Trả về chuỗi viết in thường ký tự đầu tiên.
 */
export function lowerFirst(str: string): string {
	return str.charAt(0).toLowerCase() + str.slice(1)
}
