import { RanksMap } from '../../web-extension/models/Ranks'
import { getTaxonParents } from './getTaxonParents'
import { isIncertaeSedis } from './isIncertaeSedis'
import { Taxon } from './parse'

export function getTaxonFullName(taxon: Taxon, simpleFormat: boolean = false): string {
	if (taxon.rank.level <= RanksMap.genus.level) {
		return taxon.name
	}

	const fullNames: string[] = []
	const parents: Taxon[] = [taxon, ...getTaxonParents(taxon)]

	parents: for (const parent of parents) {
		if (isIncertaeSedis(parent)) continue

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

			default:
				fullNames.unshift(`"${name}"`)
				break parents
		}
	}

	const fullName: string = fullNames.join(' ')
	return fullName
}
