import { emptySel } from './getSel'

/**
 * Gọi hàm này một lần để khởi tạo thao tác bôi đen toàn bộ từ một cách chính xác và dễ
 * dàng hơn trên trang web. Khi một từ được bôi đen mà không bắt đầu từ điểm đầu hoặc cuối
 * từ, vùng bôi đen sẽ tự động chọn toàn bộ từ đó.
 *
 * Lưu ý: Điều này cũng sẽ khiến trang web không sử dụng được chức năng kéo thả từ đã được
 * bôi đen.
 */
export function setupStickySelection(): void {
	document.addEventListener('mousedown', () => {
		emptySel()
	})

	document.addEventListener('mouseup', () => {
		const selection = getSelection()
		if (!selection || selection.isCollapsed) return

		const range = selection.getRangeAt(0)
		const textNode = range.startContainer
		if (textNode.nodeType !== Node.TEXT_NODE) return

		const text = textNode.textContent
		if (text === null) return

		let start = range.startOffset
		let end = range.endOffset

		// Mở rộng về bên trái đến khi gặp khoảng trắng hoặc đầu dòng.
		while (start > 0 && /\S/.test(text[start - 1])) start--

		// Mở rộng về bên phải đến khi gặp khoảng trắng hoặc hết dòng.
		while (end < text.length && /\S/.test(text[end])) end++

		const newRange = document.createRange()
		newRange.setStart(textNode, start)
		newRange.setEnd(textNode, end)
		selection.removeAllRanges()
		selection.addRange(newRange)
	})
}
