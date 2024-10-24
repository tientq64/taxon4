import { Taxon } from './parse'

export function checkIsIncertaeSedis(taxon: Taxon): boolean {
	return taxon.name === '?' || taxon.name === '_'
}
