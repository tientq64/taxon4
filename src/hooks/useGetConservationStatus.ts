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

export function useGetConservationStatus() {
	const { signal, abort } = makeAborter()

	const request = useRequest(
		async (taxon: Taxon): Promise<ConservationStatus | undefined> => {
			let q: string = getTaxonWikipediaQueryName(taxon, 'en')

			const res: Response = await fetch(
				`https://en.wikipedia.org/api/rest_v1/page/media-list/${q}`,
				{
					headers: fetchHeaders,
					signal
				}
			)
			const data: any = await res.json()
			if (data.items === undefined) {
				return conservationStatusesMap.NE
			}
			const item = data.items.find((item2: any) => {
				return item2.title.startsWith('File:Status_iucn')
			})
			if (item === undefined) {
				return conservationStatusesMap.NE
			}
			for (const status of conservationStatuses) {
				if (item.title.includes(status.name)) {
					return status
				}
			}
			return conservationStatusesMap.DD
		},
		{
			manual: true
		}
	)

	const requester = { ...request, abort }
	return requester
}
