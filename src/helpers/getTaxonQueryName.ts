import { getTaxonFullName } from './getTaxonFullName'
import { Taxon } from './parse'

export function getTaxonQueryName(taxon: Taxon, spacesReplacementChar?: string): string {
	let q: string = getTaxonFullName(taxon, true)

	if (spacesReplacementChar !== undefined) {
		q = q.replaceAll(' ', spacesReplacementChar)
	}
	q = encodeURIComponent(q)
	return q
}
