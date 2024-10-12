const hrefRegex: RegExp = /\/wiki\/[\w\-]+?_\(([\w\-]+?)\)/
const redLinkHrefRegex: RegExp = /title=[\w\-]+?_\(([\w\-]+?)\)/

export function extractDisambEnFromLink(el: HTMLElement): string | undefined {
	const href: string | null = el.getAttribute('href')
	if (href === null) return

	let matches: RegExpExecArray | null
	matches = hrefRegex.exec(href) ?? redLinkHrefRegex.exec(href)
	if (matches === null) return

	return '\\' + matches[1]
}
