import { rootEl } from '../script'

/**
 * Tạo hiệu ứng ripple trên element. Dùng để biết element đó đang được tương tác khi thu
 * thập dữ liệu.
 *
 * @param el Element cần tạo hiệu ứng.
 */
export function mark(el: HTMLElement): void {
	const marker = document.createElement('div')
	marker.className =
		'fixed rounded bg-blue-500 opacity-70 transition-opacity duration-500! pointer-events-none z-[99999]'
	rootEl.appendChild(marker)
	marker.offsetHeight
	marker.classList.remove('opacity-70')
	marker.classList.add('opacity-0')

	const rect = el.getBoundingClientRect()
	let expands: [number, number] = [3, 0]
	if (el.localName === 'img' || el.style.backgroundImage) {
		expands = [3, 3]
	}
	Object.assign(marker.style, {
		left: `${rect.left - expands[0]}px`,
		top: `${rect.top - expands[1]}px`,
		width: `${rect.width + expands[0] * 2}px`,
		height: `${rect.height + expands[1] * 2}px`
	})
	window.setTimeout(() => {
		marker.remove()
	}, 300)
}
