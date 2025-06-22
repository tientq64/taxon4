const { format } = Intl.NumberFormat('en')

export function formatNumber(num: number): string {
	return format(num)
}
