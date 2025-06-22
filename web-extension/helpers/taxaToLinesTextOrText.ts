import { TaxonData } from '../App'

export function taxaToLinesTextOrText(
	taxa: TaxonData[],
	removeExtinctCharIfAllExtinct: boolean = false
): string {
	const lines: string[] = []

	const sortedTaxa: TaxonData[] = taxa.toSorted((taxonA, taxonB) => {
		if (taxonA.extinct !== taxonB.extinct) {
			return taxonA.extinct ? 1 : -1
		}
		const taxonAGraft: boolean = taxonA.name.startsWith('+ ')
		const taxonBGraft: boolean = taxonB.name.startsWith('+ ')
		if (taxonAGraft !== taxonBGraft) {
			return taxonAGraft ? 1 : -1
		}
		const taxonAHybrid: boolean = taxonA.name.startsWith('x ')
		const taxonBHybrid: boolean = taxonB.name.startsWith('x ')
		if (taxonAHybrid !== taxonBHybrid) {
			return taxonAHybrid ? 1 : -1
		}
		if (taxonA.candidatus !== taxonB.candidatus) {
			return taxonA.candidatus ? 1 : -1
		}
		return 0
	})
	const isAllExtinct: boolean = taxa.every((taxon) => taxon.extinct)

	for (const taxon of sortedTaxa) {
		const cols: [
			tabs: string,
			taxonName: string,
			candidatusChar: '~' | '',
			extinctChar: '*' | '',
			disamEn: string,
			textEn: string
		] = [
			'\t'.repeat(taxon.rank.level - 1),
			taxon.name,
			taxon.candidatus ? '~' : '',
			removeExtinctCharIfAllExtinct && isAllExtinct ? '' : taxon.extinct ? '*' : '',
			taxon.disambEn ? ` ${taxon.disambEn}` : '',
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
