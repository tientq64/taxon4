import { Taxon } from './parse'

/**
 * Đếm tất cả các đơn vị phân loại con của một đơn vị phân loại, bao gồm cả các đơn vị
 * phân loại con cháu.
 *
 * @param taxon Đơn vị phân loại cần đếm.
 * @param notCountFromOtherPartFiles Nếu `true` thì sẽ không đếm các đơn vị phân loại con
 *   mà dữ liệu của nó đã được tách ra thành một tập tin riêng.
 */
export function countAllSubtaxa(taxon: Taxon, notCountFromOtherPartFiles: boolean = false): number {
	if (taxon.children === undefined) return 0

	let count: number = taxon.children.length
	for (const child of taxon.children) {
		if (notCountFromOtherPartFiles && child.dataPartFileLineCount) continue

		count += countAllSubtaxa(child, notCountFromOtherPartFiles)
	}
	return count
}
