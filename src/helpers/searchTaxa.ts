import { species } from '../constants/ranks'
import { SearchModeName } from '../constants/searchModes'
import { SearchTargetName } from '../constants/searchTargets'
import { app } from '../store/app'
import { checkCurrentSearchTarget } from './checkCurrentSearchTarget'
import { checkIsIncertaeSedis } from './checkIsIncertaeSedis'
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

	const result: Taxon[] = taxa.filter((taxon) => {
		const includeScientificName: boolean = checkCurrentSearchTarget(
			SearchTargetName.ScientificName
		)
		const includeEnglishCommonName: boolean = checkCurrentSearchTarget(
			SearchTargetName.EnglishCommonName
		)
		const includeVietnameseCommonName: boolean = checkCurrentSearchTarget(
			SearchTargetName.VietnameseCommonName
		)
		const isIncertaeSedis: boolean = checkIsIncertaeSedis(taxon)
		const isSpeciesOrLower: boolean = taxon.rank.level >= species.level

		let searchCandidates: string[] = []

		if (!isIncertaeSedis && includeScientificName) {
			let fullName: string = taxon.name
			// Nếu có dấu cách trong chuỗi tìm kiếm, và cấp bậc của ĐVPL là từ loài trở xuống thì tìm kiếm theo tên đầy đủ (danh pháp 2 phần, hoặc 3 phần).
			if (hasSpaceInSearchText && isSpeciesOrLower) {
				fullName = getTaxonFullName(taxon, true)
			}
			searchCandidates.push(fullName)
		}
		if (taxon.textEn && includeEnglishCommonName) {
			searchCandidates.push(taxon.textEn)
		}
		if (taxon.textVi && includeVietnameseCommonName) {
			searchCandidates.push(taxon.textVi)
		}

		for (let candidate of searchCandidates) {
			if (!isSearchCaseSensitive) {
				candidate = candidate.toLowerCase()
			}
			switch (searchModeName) {
				case SearchModeName.Substring:
					if (candidate.includes(searchText)) return true
					break
				case SearchModeName.WholeWord:
					if (wholeWordSearchRegex.test(candidate)) return true
					break
				case SearchModeName.Exact:
					if (candidate === searchText) return true
					break
			}
		}
		return false
	})
	return result
}
