import { VirtualTaxon } from '../pages/MainPage'
import { app } from '../store/app'
import { Taxon } from './parse'

export function getActiveTaxonFromVirtualTaxa(virtualTaxa?: VirtualTaxon[]): Taxon | undefined {
	virtualTaxa ??= app.virtualTaxa

	return virtualTaxa.at(app.linesOverscan)?.data
}
