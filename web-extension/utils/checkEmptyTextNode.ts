/**
 * Kiểm tra giá trị truyền vào có phải là một text node trống hay không. Trống nghĩa là không có giá trị hoặc chỉ có khoảng trắng.
 * @param node Bất cứ thứ gì.
 * @returns Kết quả kiểm tra, kiểu boolean.
 */
export function checkEmptyTextNode(node: unknown) {
	if (node instanceof Text && node.wholeText.trim() === '') {
		return true
	}
	return false
}
