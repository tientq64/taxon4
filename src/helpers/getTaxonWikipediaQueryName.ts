import { getTaxonQueryName } from './getTaxonQueryName'
import { Taxon } from './parse'

export function getTaxonWikipediaQueryName(taxon: Taxon, languageCode: string): string {
	let disamb: string | undefined = languageCode === 'en' ? taxon.disambEn : taxon.disambVi
	if (disamb === '/') {
		return '/'
	}
	let q: string = getTaxonQueryName(taxon, '_')
	if (disamb) {
		const disambSymb: string = disamb[0]
		const disambText: string = disamb.substring(1)
		if (disambSymb === '/') {
			q = disambText
		} else if (disambSymb === '\\') {
			q += `_(${disambText})`
		}
	}
	return q
}
