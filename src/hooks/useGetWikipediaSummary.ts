import { useRequest } from 'ahooks'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'

export function useGetWikipediaSummary() {
	const aborter: AbortController = new AbortController()

	const request = useRequest(
		async (taxon: Taxon, languageCode: string): Promise<string | undefined> => {
			let q: string = getTaxonWikipediaQueryName(taxon, languageCode)

			const data: any = await (
				await fetch(`https://${languageCode}.wikipedia.org/api/rest_v1/page/summary/${q}`, {
					signal: aborter.signal
				})
			).json()

			let summary: string = data.extract_html
			if (summary) {
				summary = summary.replace(/<p>(.+?)<\/p>.*/s, '$1')
			}
			return summary
		},
		{
			manual: true
		}
	)

	const requester = {
		...request,
		abort: aborter.abort.bind(aborter)
	}
	return requester
}
