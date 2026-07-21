import { getTaxonParents } from './getTaxonParents'
import { Taxon } from './parse'

export function getTaxonIcon(taxon: Taxon): string | undefined {
	if (taxon.icon) return taxon.icon

	const parents = getTaxonParents(taxon)
	const ancestor = parents.find((parent) => parent.icon)

	return ancestor?.icon
}
