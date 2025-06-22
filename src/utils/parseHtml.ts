export function parseHtml(html: string): Document {
	const parser = new DOMParser()

	return parser.parseFromString(html, 'text/html')
}
