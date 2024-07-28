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
