import { RanksMap } from '../constants/ranks'
import { SearchModeName } from '../constants/searchModes'
import { app } from '../store/app'
import { getTaxonFullName } from './getTaxonFullName'
import { Taxon } from './parse'

export function searchTaxa(taxa: Taxon[], searchText: string): Taxon[] {
	searchText = searchText.trim()
	if (searchText === '') return []

	const { isSearchCaseSensitive, searchModeName } = app

	if (!isSearchCaseSensitive) {
		searchText = searchText.toLowerCase()
	}
	const wholeWordSearchRegex: RegExp = RegExp(`(?:^|[- ])${RegExp.escape(searchText)}(?:[- ]|$)`)
	const hasSpaceInSearchText: boolean = searchText.includes(' ')

	return taxa.filter((taxon) => {
		let fullName: string = taxon.name

		// Nếu có dấu cách trong chuỗi tìm kiếm và cấp bậc của loài là từ loài trở xuống thì tìm kiếm theo tên đầy đủ, nghĩa là danh pháp 2 phần, hoặc 3 phần.
		if (hasSpaceInSearchText && taxon.rank.level >= RanksMap.species.level) {
			fullName = getTaxonFullName(taxon, true)
		}

		let searchTargets: string[] = [fullName]
		if (taxon.textEn) {
			searchTargets.push(taxon.textEn)
		}
		if (taxon.textVi) {
			searchTargets.push(taxon.textVi)
		}

		for (let searchTarget of searchTargets) {
			if (!isSearchCaseSensitive) {
				searchTarget = searchTarget.toLowerCase()
			}
			switch (searchModeName) {
				case SearchModeName.Substring:
					if (searchTarget.includes(searchText)) return true
					break
				case SearchModeName.WholeWord:
					if (wholeWordSearchRegex.test(searchTarget)) return true
					break
				case SearchModeName.Exact:
					if (searchTarget === searchText) return true
					break
			}
		}
		return false
	})
}
