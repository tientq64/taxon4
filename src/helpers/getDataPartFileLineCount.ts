import { Taxon } from './parse'

/**
 * Trả về số lượng dòng trong tập tin dữ liệu nếu đơn vị phân loại này được tách ra thành
 * một tập tin riêng.
 */
export function getDataPartFileLineCount(taxon: Taxon): number {
	if (taxon.dataPartFileLineCount) {
		return taxon.dataPartFileLineCount
	}
	if (taxon.parent === undefined) {
		throw Error('Không tìm thấy tổng số dòng của file dữ liệu cho đơn vị phân loại này.')
	}
	return getDataPartFileLineCount(taxon.parent)
}
