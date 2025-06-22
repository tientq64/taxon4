import {
	ConservationStatus,
	conservationStatuses,
	conservationStatusesMap
} from '../constants/conservationStatuses'
import { fetchHeaders } from '../helpers/fetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'

export async function getConservationStatus(taxon: Taxon): Promise<ConservationStatus | null> {
	const q: string = getTaxonWikipediaQueryName(taxon, 'en')
	const { NE, DD } = conservationStatusesMap

	const res: Response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${q}`, {
		headers: fetchHeaders
	})
	if (!res.ok) return NE

	const data: any = await res.json()
	if (data.items === undefined) return NE

	const item = data.items.find((item2: any) => {
		return item2.title.startsWith('File:Status_iucn')
	})
	if (item === undefined) return NE

	for (const status of conservationStatuses) {
		if (item.title.includes(status.name)) {
			return status
		}
	}

	return DD
}
