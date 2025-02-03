import { RanksMap } from '../../web-extension/constants/Ranks'
import { checkIsIncertaeSedis } from './checkIsIncertaeSedis'
import { getTaxonParents } from './getTaxonParents'
import { Taxon } from './parse'

export function getTaxonFullName(taxon: Taxon, simpleFormat: boolean = false): string {
	if (taxon.rank.level <= RanksMap.genus.level) {
		return taxon.name
	}

	const fullNames: string[] = []
	const parents: Taxon[] = [taxon, ...getTaxonParents(taxon)]

	parents: for (let i = 0; i < parents.length; i++) {
		const parent: Taxon = parents[i]
		if (checkIsIncertaeSedis(parent)) continue

		const name: string = parent.name
		switch (parent.rank) {
			case RanksMap.form:
				fullNames.unshift(RanksMap.form.abbrPrefix!, name)
				break

			case RanksMap.variety:
				if (name[0] === name[0].toUpperCase()) {
					fullNames.unshift(`'${name}'`)
				} else {
					fullNames.unshift(RanksMap.variety.abbrPrefix!, name)
				}
				break

			case RanksMap.subspecies:
			case RanksMap.species:
				fullNames.unshift(name)
				break

			case RanksMap.subgenus:
				if (!simpleFormat) {
					fullNames.unshift(`(${name})`)
				}
				break

			case RanksMap.genus:
				fullNames.unshift(name)
				break parents

			case RanksMap.section2:
			case RanksMap.subsection2:
			case RanksMap.series:
			case RanksMap.subseries:
			case RanksMap.superspecies:
				if (i > 0) break
				fullNames.unshift(name)
				break parents

			default:
				fullNames.unshift(`"${name}"`)
				break parents
		}
	}

	const fullName: string = fullNames.join(' ')
	return fullName
}
