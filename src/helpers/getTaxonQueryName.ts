import { getTaxonFullName } from './getTaxonFullName'
import { Taxon } from './parse'

/**
 * Trả về chuỗi truy vấn của đơn vị phân loại này. Chuỗi truy vấn là tên khoa học của đơn
 * vị phân loại, được mã hóa để có thể sử dụng như tham số trong URL.
 *
 * @param taxon Đơn vị phân loại.
 * @param spacesReplacementChar Thay thế tất cả ký tự dấu cách (`' '`) bằng ký tự này.
 * @returns Tên khoa học đã được mã hóa thành chuỗi truy vấn.
 */
export function getTaxonQueryName(taxon: Taxon, spacesReplacementChar?: string): string {
	let q: string = getTaxonFullName(taxon, true)

	if (spacesReplacementChar !== undefined) {
		q = q.replaceAll(' ', spacesReplacementChar)
	}
	q = encodeURIComponent(q)

	return q
}
