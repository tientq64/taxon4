interface GetTextNodesOptions {
	/**
	 * Không chọn các text node trống hoặc chỉ chứa khoảng trắng.
	 */
	noEmpty?: boolean
}

/**
 * Tìm và trả về các text node con của element.
 *
 * @param el Element cần tìm.
 * @param options Tùy chọn tìm kiếm.
 * @returns Các text node con của element cần tìm.
 */
export function getTextNodes(el: HTMLElement, options: GetTextNodesOptions = {}): Text[] {
	const nodes = Array.from(el.childNodes)
	const textNodes: Text[] = []

	for (const node of nodes) {
		if (node instanceof Text) {
			if (!options.noEmpty || node.wholeText.trim() !== '') {
				textNodes.push(node)
			}
		}
	}
	return textNodes
}
