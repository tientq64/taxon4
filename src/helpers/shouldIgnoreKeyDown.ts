/**
 * Kiểm tra xem sự kiện `keydown` có nên bị bỏ qua hay không. Bỏ qua nếu phím được giữ
 * (repeat) hoặc nếu phần tử hiện tại là `input` hoặc `textarea`.
 *
 * @param event Sự kiện bàn phím.
 * @returns `true` nếu sự kiện nên bị bỏ qua, ngược lại `false`.
 */
export function shouldIgnoreKeyDown(event: KeyboardEvent): boolean {
	if (event.repeat) return true

	if (document.activeElement === null) return false
	if (document.activeElement.matches('input, textarea')) return true

	return false
}
