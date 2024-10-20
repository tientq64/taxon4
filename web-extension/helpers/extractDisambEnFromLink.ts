const liveLinkHrefRegex: RegExp = /\/wiki\/[\w\-]+?_\(([\w\-]+?)\)/
const deadLinkHrefRegex: RegExp = /title=[\w\-]+?_\(([\w\-]+?)\)/

/**
 * Trích xuất ra văn bản [định hướng](https://vi.wikipedia.org/wiki/Wikipedia:%C4%90%E1%BB%8Bnh_h%C6%B0%E1%BB%9Bng) của Wikipedia trong link.
 * @param el Element để lấy văn bản định hướng.
 * @returns Văn bản định hướng nếu có (bao gồm cả dấu `\` ở đầu), còn không trả về `undefined`.
 * @example
 * const link // <a href="Nica_(butterfly)">Nica</a>
 * extractDisambEnFromLink(link) // '\\butterfly'
 */
export function extractDisambEnFromLink(el: HTMLElement): string | undefined {
	const href: string | null = el.getAttribute('href')
	if (href === null) return

	let matches: RegExpExecArray | null
	matches = liveLinkHrefRegex.exec(href) ?? deadLinkHrefRegex.exec(href)
	if (matches === null) return

	return '\\' + matches[1]
}
