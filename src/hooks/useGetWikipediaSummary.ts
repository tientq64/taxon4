import { useRequest } from 'ahooks'
import { fetchHeaders } from '../helpers/fetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'
import { makeAborter } from '../helpers/makeAborter'

export function useGetWikipediaSummary() {
	const { signal, abort } = makeAborter()

	const request = useRequest(
		async (taxon: Taxon, languageCode: string): Promise<string | undefined> => {
			let q: string = getTaxonWikipediaQueryName(taxon, languageCode)

			const res: Response = await fetch(
				`https://${languageCode}.wikipedia.org/api/rest_v1/page/summary/${q}`,
				{
					headers: fetchHeaders,
					signal
				}
			)
			const data: any = await res.json()

			let summary: string = data.extract_html
			if (summary) {
				const parser: DOMParser = new DOMParser()
				const dom: Document = parser.parseFromString(summary, 'text/html')
				const paragraphEl = dom.querySelector<HTMLParagraphElement>('p')
				let tfdEls = dom.querySelectorAll<HTMLSpanElement>('span.tfd')
				for (const tfdEl of tfdEls) {
					tfdEl.remove()
				}
				if (paragraphEl === null) return
				summary = paragraphEl.innerHTML
			}
			return summary
		},
		{
			manual: true
		}
	)

	const requester = { ...request, abort }
	return requester
}
