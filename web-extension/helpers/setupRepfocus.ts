import { ext } from '../store/ext'
import { $ } from '../utils/jquery'
import { setupStickySelection } from './setupStickySelection'

/** Hàm được gọi khi truy cập trang RepFocus. */
export function setupRepfocus(): void {
	const { sites } = ext

	if (!sites.repfocus) return

	const needRemoveSizeAttrFontEls = document.querySelectorAll<HTMLFontElement>('font')
	for (const el of needRemoveSizeAttrFontEls) {
		if (el.localName === 'font') {
			el.removeAttribute('size')
		}
	}

	const comnameEls = document.querySelectorAll<HTMLFontElement>(
		'td:has(> font > img[src="DIV/UK_12v.gif"]) + td > font'
	)
	comnameEls.forEach((comnameEl, index) => {
		const comnames: string[] = comnameEl.innerText.trim().replace(/[()]+/g, '').split(', ')

		comnameEl.innerHTML = comnames
			.map((comname) => {
				return `<div class="common">
					<span class="comname">${comname}</span>
				</div>`
			})
			.join('')

		const speciesEl = comnameEl.closest<HTMLTableRowElement>('tr:has(> td > table)')
		if (speciesEl === null) return
		speciesEl.classList.add(index === 0 ? 'genus' : 'species')

		const binomialEl = speciesEl.querySelector<HTMLElement>(
			':scope > td:nth-child(2) > font > i'
		)
		if (binomialEl === null) return
		binomialEl.classList.add('binomial')
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
