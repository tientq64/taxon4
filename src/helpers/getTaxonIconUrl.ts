export function getTaxonIconUrl(icon: string): string {
	const subIcon: string = icon.slice(0, -3)

	return `https://cdn-icons-png.flaticon.com/32/${subIcon}/${icon}.png`
}
