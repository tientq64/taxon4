import { ext } from '../store/ext'
import { $ } from '../utils/jquery'
import { setupStickySelection } from './setupStickySelection'

/** Hàm được gọi khi truy cập trang Repfocus. */
export function setupRepfocus(): void {
	const { sites } = ext

	if (!sites.repfocus) return

	$('font').removeAttr('size')

	const $comnames = $('td:has(> font > img[src="DIV/UK_12v.gif"]) + td > font')
	$comnames.each((index, comnameEl) => {
		const $comname = $(comnameEl)

		const comnamesHtml: string = $comname
			.text()
			.trim()
			.replace(/[()]+/g, '')
			.split(', ')
			.filter((text) => text !== 'no common name')
			.map((comname) => {
				return `<div class="common">
					<span class="comname">${comname}</span>
				</div>`
			})
			.join('')
		$comname.html(comnamesHtml)

		const $species = $comname.closest('tr:has(> td > table)')
		$species.addClass(index === 0 ? 'genus' : 'species')

		const $binomial = $species.find('> td:nth-child(2) > font > i').first()
		$binomial.addClass('binomial')
	})

	setupStickySelection()

	document.addEventListener('contextmenu', (event: MouseEvent) => {
		if (event.target === null) return

		event.preventDefault()
		event.stopPropagation()

		const $comname = $(event.target).closest('.comname')
		const $parentComname = $comname.parent()
		$parentComname.parent().prepend($parentComname)
	})
}
