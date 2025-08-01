import { Taxon } from './parse'

export function countAllSubtaxa(taxon: Taxon): number {
	if (taxon.children === undefined) return 0

	let count: number = taxon.children.length

	for (const child of taxon.children) {
		count += countAllSubtaxa(child)
	}

	return count
}
