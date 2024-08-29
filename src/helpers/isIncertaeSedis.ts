import { Taxon } from './parse'

export function isIncertaeSedis(taxon: Taxon): boolean {
	return taxon.name === '?' || taxon.name === '_'
}
