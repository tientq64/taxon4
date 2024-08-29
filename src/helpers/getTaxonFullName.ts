import { lessThanOrEqualSpecies, RanksMap } from '../../web-extension/models/Ranks'
import { getTaxonParents } from './getTaxonParents'
import { isIncertaeSedis } from './isIncertaeSedis'
import { Taxon } from './parse'

export function getTaxonFullName(taxon: Taxon, simple: boolean = false): string {
	const fullNames: string[] = []

	if (lessThanOrEqualSpecies(taxon)) {
		const parents: Taxon[] = getTaxonParents(taxon)

		const genus: Taxon | undefined = parents.find(
			(parent) => parent.rank.level === RanksMap.genus.level && !isIncertaeSedis(parent)
		)
		const subgenus: Taxon | undefined = parents.find(
			(parent) => parent.rank.level === RanksMap.subgenus.level && !isIncertaeSedis(parent)
		)
		const species: Taxon | undefined = parents.find(
			(parent) => parent.rank.level === RanksMap.species.level
		)
		const subspecies: Taxon | undefined = parents.find(
			(parent) => parent.rank.level === RanksMap.subspecies.level && !isIncertaeSedis(parent)
		)
		const variety: Taxon | undefined = parents.find(
			(parent) => parent.rank.level === RanksMap.variety.level && !isIncertaeSedis(parent)
		)
		const form: Taxon | undefined = parents.find(
			(parent) => parent.rank.level === RanksMap.form.level
		)
		const tempGenus: Taxon | undefined = parents.find(
			(parent) => parent.rank.level < RanksMap.genus.level && !isIncertaeSedis(parent)
		)

		if (genus) {
			fullNames.push(genus.name)
		} else if (tempGenus) {
			fullNames.push(`"${tempGenus.name}"`)
		}
		if (subgenus && !simple) {
			fullNames.push(`(${subgenus.name})`)
		}
		if (species) {
			fullNames.push(species.name)
		}
		if (subspecies) {
			fullNames.push(subspecies.name)
		}
		if (variety) {
			fullNames.push(`${variety.rank.abbrPrefix} ${variety.name}`)
		}
		if (form) {
			fullNames.push(`${form.rank.abbrPrefix} ${form.name}`)
		}
	}
	fullNames.push(taxon.name)

	const fullName: string = fullNames.join(' ')
	return fullName
}
