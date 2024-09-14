import { filter } from 'lodash-es'
import { TaxonData } from '../App'

export function taxaToLinesTextOrText(taxa: TaxonData[]): string {
	const lines: string[] = []

	const existsTaxa: TaxonData[] = filter(taxa, { extinct: false })
	const extinctTaxa: TaxonData[] = filter(taxa, { extinct: true })
	const sortedTaxa: TaxonData[] = [...existsTaxa, ...extinctTaxa]

	for (const taxon of sortedTaxa) {
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
