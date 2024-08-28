import { getTaxonFullName } from './getTaxonFullName'
import { Taxon } from './parse'

export function getTaxonWikipediaQueryName(taxon: Taxon): string {
	let q: string = getTaxonFullName(taxon)
	q = q
		.replace(/\"(.+?)\"/, '$1')
		.replace(/ \(.+?\)/, '')
		.replace(/ /g, '_')

	let disamb: string | undefined = taxon.disambEn
	if (disamb) {
		if (disamb[0] === '/') {
			q = disamb.substring(1)
		} else {
			q += `_(${disamb})`
		}
	}
	q = encodeURIComponent(q)
	return q
}
