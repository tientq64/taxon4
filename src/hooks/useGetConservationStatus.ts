import { useRequest } from 'ahooks'
import { fetchHeaders } from '../helpers/fetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { makeAborter } from '../helpers/makeAborter'
import { Taxon } from '../helpers/parse'
import {
	ConservationStatus,
	conservationStatuses,
	conservationStatusesMap
} from '../models/conservationStatuses'

async function getConservationStatus(
	signal: AbortSignal,
	taxon: Taxon
): Promise<ConservationStatus | null> {
	let q: string = getTaxonWikipediaQueryName(taxon, 'en')
	const { NE, DD } = conservationStatusesMap

	const res: Response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${q}`, {
		headers: fetchHeaders,
		signal
	})
	if (!res.ok) {
		return NE
	}
	const data: any = await res.json()
	if (data.items === undefined) {
		return NE
	}

	const item = data.items.find((item2: any) => {
		return item2.title.startsWith('File:Status_iucn')
	})
	if (item === undefined) {
		return NE
	}
	for (const status of conservationStatuses) {
		if (item.title.includes(status.name)) {
			return status
		}
	}
	return DD
}

export function useGetConservationStatus() {
	const { signal, abort } = makeAborter()
	const request = useRequest(getConservationStatus.bind(null, signal), {
		manual: true
	})
	request.cancel = abort
	return request
}
