type Options = {
	noEmpty?: boolean
}

export function getTextNodes(el: HTMLElement, { noEmpty = false }: Options = {}): Text[] {
	const nodes = Array.from(el.childNodes)
	const textNodes: Text[] = []
	for (const node of nodes) {
		if (node instanceof Text) {
			if (!noEmpty || node.wholeText.trim() !== '') {
				textNodes.push(node)
			}
		}
	}
	return textNodes
}
