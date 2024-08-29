import { getTaxonQueryName } from './getTaxonQueryName'
import { Taxon } from './parse'

export function getTaxonWikipediaQueryName(taxon: Taxon): string {
	let q: string = getTaxonQueryName(taxon, '_')

	let disamb: string | undefined = taxon.disambEn
	if (disamb) {
		if (disamb[0] === '/') {
			q = disamb.substring(1)
		} else {
			q += `_(${disamb})`
		}
	}
	return q
}
