import { getTaxonParents } from './getTaxonParents'
import { Taxon } from './parse'

export function getTaxonIcon(taxon: Taxon): string | undefined {
	if (taxon.icon) {
		return taxon.icon
	}
	const parents: Taxon[] = getTaxonParents(taxon)
	const ancestor: Taxon | undefined = parents.find((parent) => {
		return parent.icon !== undefined
	})

	return ancestor?.icon
}
