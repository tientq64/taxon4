import { rootEl } from '../script'

export function mark(el: HTMLElement): void {
	const marker: HTMLDivElement = document.createElement('div')
	marker.className =
		'fixed rounded bg-blue-500 opacity-70 transition-opacity duration-500 pointer-events-none'
	rootEl.appendChild(marker)
	marker.offsetHeight
	marker.classList.remove('opacity-70')
	marker.classList.add('opacity-0')

	const rect: DOMRect = el.getBoundingClientRect()
	let paddings: number[] = [3, 0]
	if (el.localName === 'img' || el.style.backgroundImage) {
		paddings = [3, 3]
	}
	Object.assign(marker.style, {
		left: `${rect.left - paddings[0]}px`,
		top: `${rect.top - paddings[1]}px`,
		width: `${rect.width + paddings[0] * 2}px`,
		height: `${rect.height + paddings[1] * 2}px`
	})
	setTimeout(() => {
		marker.remove()
	}, 300)
}
