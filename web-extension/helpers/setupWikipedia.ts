import { ext } from '../store/ext'
import { $ } from '../utils/jquery'

/** Hàm được gọi khi truy cập trang Wikipedia. */
export function setupWikipedia(): void {
	const { sites } = ext

	if (!sites.wikipedia) return

	$('[accesskey]').removeAttr('accesskey')

	const $el = $('table.biota tr a[title*="strain" i]:not(.taxon4Formated)')
	if ($el[0]) {
		$el.addClass('taxon4Formated')
		const $td = $el.closest('tr').next().find('td')
		const ul = document.createElement('ul')
		ul.className = 'text-left'
		for (const node of $td[0].childNodes) {
			if (node instanceof Text) {
				const li = document.createElement('li')
				ul.appendChild(li)
				const i = document.createElement('i')
				li.appendChild(i)
				i.textContent = node.wholeText
			}
		}
		$td[0].replaceChildren(ul)
	}

	underlineDisambiguationLink()
}

/** Gạch chân các link có chứa văn bản định hướng trên trang, giúp dễ nhận biết hơn. */
function underlineDisambiguationLink(): void {
	const $links = $<HTMLAnchorElement>('a[href]')

	$links
		.filter((_, el) => {
			return /[\w\-_%]+_\([\w\-_%]+\)/.test(el.href)
		})
		.addClass('underline underline-offset-2 decoration-2')
}
