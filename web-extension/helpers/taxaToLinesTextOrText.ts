import { TaxonData } from '../App'

export function taxaToLinesTextOrText(taxa: TaxonData[]): string {
	const lines: string[] = []

	for (const taxon of taxa) {
		const cols: string[] = [
			'\t'.repeat(taxon.rank.level - 1),
			taxon.name,
			taxon.extinct ? '*' : '',
			taxon.textEn ? ` - ${taxon.textEn}` : ''
		]
		if (!taxon.name) {
			return cols[3]
		}
		const line: string = cols.join('')
		lines.push(line)
	}

	const linesText: string = '\n' + lines.join('\n')
	return linesText
}
