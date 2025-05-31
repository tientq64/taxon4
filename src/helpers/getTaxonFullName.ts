import { RanksMap } from '../../web-extension/constants/Ranks'
import { checkIsIncertaeSedis } from './checkIsIncertaeSedis'
import { getTaxonNameWithStandardHybridChar } from './getTaxonNameWithStandardHybridChar'
import { getTaxonParents } from './getTaxonParents'
import { Taxon } from './parse'

export function getTaxonFullName(
	taxon: Taxon,
	simpleFormat: boolean = false,
	standardHybridChar: boolean = false
): string {
	if (taxon.rank.level <= RanksMap.genus.level) {
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

	const fullName: string = nameParts.join(' ')
	return fullName
}
