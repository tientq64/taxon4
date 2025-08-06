import { Taxon } from './parse'

export function countAllSubtaxa(taxon: Taxon, notCountFromOtherPartFiles: boolean = false): number {
	if (taxon.children === undefined) return 0

	let count: number = taxon.children.length

	for (const child of taxon.children) {
		if (notCountFromOtherPartFiles && child.dataPartFileLineCount) {
			continue
		}
		count += countAllSubtaxa(child, notCountFromOtherPartFiles)
	}

	return count
}
