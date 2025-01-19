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
	const parentEl: HTMLElement | null = el.closest(closest)
	if (parentEl === null) return null

	const childEl: HTMLElement | null = parentEl.querySelector(selector)
	return childEl
}
