import { Taxon } from './parse'

export function getTaxonParents(taxon: Taxon): Taxon[] {
	const parents: Taxon[] = []

	let parent = taxon.parent
	while (parent !== undefined) {
		parents.push(parent)
		parent = parent.parent
	}
	return parents
}
