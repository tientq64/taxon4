import { TaxonData } from '../pages/App'

export function taxaToLinesText(taxa: TaxonData[]): string {
	const lines: string[] = []

	for (const taxon of taxa) {
		const cols: string[] = [
			'\t'.repeat(taxon.rank.level - 1),
			taxon.name,
			taxon.extinct ? '*' : '',
			taxon.textEn ? ` - ${taxon.textEn}` : ''
		]
		const line: string = cols.join('')
		lines.push(line)
	}

	const linesText: string = '\n' + lines.join('\n')
	return linesText
}
