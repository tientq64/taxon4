export function parsePhotoSides(viewBox: string | undefined, isDev: boolean): number[] {
	if (viewBox === undefined) return []

	if (isDev && viewBox === '') {
		throw Error('viewBox hình ảnh không được để trống.')
	}
	const sides: number[] = viewBox.split(',').map(Number)

	if (isDev && sides.length > 1) {
		if (sides.every((side) => side === sides[0])) {
			throw Error('Các giá trị cạnh trùng lặp.')
		}
		if (sides.length === 3) {
			if (sides[0] === sides[2]) {
				throw Error('Cạnh dưới trùng cạnh trên.')
			}
		}
		if (sides.length === 4) {
			if (sides[1] === sides[3]) {
				if (sides[0] === sides[2]) {
					throw Error('Cạnh dưới trùng cạnh trên, cạnh trái trùng cạnh phải.')
				}
				throw Error('Cạnh trái trùng cạnh phải.')
			}
		}
	}
	return sides
}
