import { find } from 'lodash-es'
import { getTaxonParents } from './getTaxonParents'
import { Taxon } from './parse'

export function getTaxonIcon(taxon: Taxon): string | undefined {
	if (taxon.icon) {
		return taxon.icon
	}
	const parents: Taxon[] = getTaxonParents(taxon)
	const ancestor: Taxon | undefined = find(parents, 'icon')
	return ancestor?.icon
}
