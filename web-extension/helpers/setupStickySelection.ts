import { emptySel } from './getSel'

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

		// Mở rộng về bên trái đến khi gặp khoảng trắng hoặc đầu dòng
		while (start > 0 && /\S/.test(text[start - 1])) start--

		// Mở rộng về bên phải đến khi gặp khoảng trắng hoặc hết dòng
		while (end < text.length && /\S/.test(text[end])) end++

		const newRange = document.createRange()
		newRange.setStart(textNode, start)
		newRange.setEnd(textNode, end)
		selection.removeAllRanges()
		selection.addRange(newRange)
	})
}
