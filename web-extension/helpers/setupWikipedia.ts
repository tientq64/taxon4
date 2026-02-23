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
		const $ul = $('<ul>').addClass('text-left')

		for (const node of $td[0].childNodes) {
			if (!(node instanceof Text)) continue

			const $i = $('<i>').text(node.wholeText)
			const $li = $('<li>').append($i)
			$ul.append($li)
		}
		$td.empty().append($ul)
	}

	underlineDisambiguationLink()
}

/** Gạch chân các link có chứa văn bản định hướng trên trang, giúp dễ nhận biết hơn. */
function underlineDisambiguationLink(): void {
	$<HTMLAnchorElement>('a[href]')
		.filter((_, el) => {
			return /[\w\-_%]+_\([\w\-_%]+\)/.test(el.href)
		})
		.addClass('underline underline-offset-2 decoration-2')
}
