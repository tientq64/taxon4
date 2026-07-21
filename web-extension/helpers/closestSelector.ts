/**
 * Tìm phần tử bằng cách chọn phần tử cha, sau đó chọn tiếp phần tử con trong phần tử cha
 * đã chọn.
 *
 * @param el Phần tử bất kỳ.
 * @param closest Bộ chọn để lấy phần tử cha.
 * @param selector Bộ chọn để lấy phần tử con của phần tử cha đã chọn.
 * @returns Phần tử tìm thấy.
 */
export function closestSelector(
	el: HTMLElement,
	closest: string,
	selector: string
): HTMLElement | null {
	const parentEl = el.closest<HTMLElement>(closest)
	if (!parentEl) return null

	const childEl = parentEl.querySelector<HTMLElement>(selector)
	return childEl
}
