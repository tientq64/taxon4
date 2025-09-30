import { RanksMap } from '../constants/ranks'
import { getTaxonFullName } from './getTaxonFullName'
import { Taxon } from './parse'

export function searchTaxon(taxa: Taxon[], searchText: string): Taxon[] {
	searchText = searchText.trim()
	if (searchText === '') return []

	const hasSpaceInSearchText: boolean = searchText.includes(' ')

	return taxa.filter((taxon) => {
		let fullName: string = taxon.name

		// Nếu có dấu cách trong chuỗi tìm kiếm và cấp bậc của loài là từ loài trở xuống thì tìm kiếm theo tên đầy đủ, nghĩa là danh pháp 2 phần, hoặc 3 phần.
		if (hasSpaceInSearchText && taxon.rank.level >= RanksMap.species.level) {
			fullName = getTaxonFullName(taxon, true)
		}

		const found: boolean =
			fullName.startsWith(searchText) ||
			!!taxon.textEn?.includes(searchText) ||
			!!taxon.textVi?.includes(searchText)

		return found
	})
}
