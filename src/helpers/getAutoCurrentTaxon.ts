import { SubTaxon } from '../pages/MainPage'
import { app } from '../store/useAppStore'
import { Taxon } from './parse'

export function getAutoCurrentTaxon(subTaxa?: SubTaxon[]): Taxon | undefined {
	return (subTaxa ?? app.subTaxa).at(app.linesOverscan)?.data
}
