import { genus, RanksMap } from '../constants/ranks'
import { checkIsIncertaeSedis } from './checkIsIncertaeSedis'
import { getTaxonNameWithStandardHybridChar } from './getTaxonNameWithStandardHybridChar'
import { getTaxonParents } from './getTaxonParents'
import { Taxon } from './parse'

/**
 * Lấy tên khoa học đầy đủ của một đơn vị phân loại.
 *
 * @param taxon Đơn vị phân loại cần lấy tên khoa học đầy đủ.
 * @param simpleFormat Bỏ qua bậc phân loại phụ trong tên như phân chi.
 * @param standardHybridChar Sử dụng ký tự lai chuẩn "×" thay vì "x" trong tên khoa học.
 * @returns Tên khoa học đầy đủ của đơn vị phân loại.
 */
export function getTaxonFullName(
	taxon: Taxon,
	simpleFormat: boolean = false,
	standardHybridChar: boolean = false
): string {
	if (taxon.name === '?') return 'Incertae sedis'
	if (taxon.name === '_') return 'Unassigned'

	if (taxon.rank.level <= genus.level) {
		return standardHybridChar ? getTaxonNameWithStandardHybridChar(taxon.name) : taxon.name
	}

	const nameParts: string[] = []
	const taxonParts: Taxon[] = [taxon, ...getTaxonParents(taxon)]

	taxonPartsLoop: for (let i = 0; i < taxonParts.length; i++) {
		const taxonPart: Taxon = taxonParts[i]
		if (checkIsIncertaeSedis(taxonPart)) continue

		const name: string = standardHybridChar
			? getTaxonNameWithStandardHybridChar(taxonPart.name)
			: taxonPart.name
		const isParentPart: boolean = i > 0

		switch (taxonPart.rank) {
			case RanksMap.form:
				nameParts.unshift(taxonPart.rank.abbrPrefix!, name)
				break

			case RanksMap.variety:
				if (name[0] === name[0].toUpperCase()) {
					nameParts.unshift(`"${name}"`)
				} else {
					nameParts.unshift(taxonPart.rank.abbrPrefix!, name)
				}
				break

			case RanksMap.subspecies:
			case RanksMap.species:
				nameParts.unshift(name)
				break

			case RanksMap.subgenus:
				if (!simpleFormat) {
					nameParts.unshift(`(${name})`)
				}
				break

			case RanksMap.genus:
				nameParts.unshift(name)
				break taxonPartsLoop

			case RanksMap.sectionBotany:
			case RanksMap.subsectionBotany:
				if (isParentPart) break
				nameParts.unshift(taxonPart.rank.abbrPrefix!, name)
				break

			case RanksMap.series:
			case RanksMap.subseries:
			case RanksMap.superspecies:
				if (isParentPart) break
				nameParts.unshift(name)
				break taxonPartsLoop

			default:
				nameParts.unshift(`"${name}"`)
				break taxonPartsLoop
		}
	}

	return nameParts.join(' ')
}
