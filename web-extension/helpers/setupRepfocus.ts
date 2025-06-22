import { ext } from '../store/ext'
import { $ } from '../utils/jquery'
import { emptySel } from './getSel'

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

	document.addEventListener('contextmenu', (event: MouseEvent) => {
		if (event.target === null) return

		event.preventDefault()
		event.stopPropagation()

		const $comname = $(event.target).closest('.comname')
		const $parentComname = $comname.parent()
		$parentComname.parent().prepend($parentComname)
	})
}
