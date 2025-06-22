export function percent(current: number, total: number): number
export function percent(current: number, total: number, percentUnit: boolean): string

export function percent(
	current: number,
	total: number,
	percentUnit: boolean = false
): number | string {
	const result: number = (current / total) * 100

	if (percentUnit) {
		return result + '%'
	}

	return result
}
