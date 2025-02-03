/**
 * Chia lấy phần dư, với kết quả là số dương.
 *
 * @param a Số chia.
 * @param n Số bị chia.
 * @returns Phần dư.
 */
export function modulo(a: number, n: number): number {
	return ((a % n) + n) % n
}
