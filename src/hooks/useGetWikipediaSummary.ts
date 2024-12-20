import { useRequest } from 'ahooks'
import { fetchHeaders } from '../helpers/fetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'

async function getWikipediaSummary(taxon: Taxon, languageCode: string): Promise<string | null> {
	let q: string = getTaxonWikipediaQueryName(taxon, languageCode)

	const res: Response = await fetch(
		`https://${languageCode}.wikipedia.org/api/rest_v1/page/summary/${q}`,
		{
			headers: fetchHeaders
		}
	)
	if (!res.ok) return null

	const data: any = await res.json()
	let summary: string = data.extract_html
	if (summary === undefined) return null

	const parser: DOMParser = new DOMParser()
	const dom: Document = parser.parseFromString(summary, 'text/html')
	const paragraphEl = dom.querySelector<HTMLParagraphElement>('p')
	let shouldRemoveEls = dom.querySelectorAll<HTMLSpanElement>('span.tfd')
	for (const el of shouldRemoveEls) {
		el.remove()
	}
	if (paragraphEl === null) return null

	summary = paragraphEl.innerHTML
	summary = summary.replace(/:$/, '.')
	return summary
}

export function useGetWikipediaSummary(taxon: Taxon, languageCode: string) {
	const request = useRequest(
		() => {
			return getWikipediaSummary(taxon, languageCode)
		},
		{ manual: true }
	)
	return request
}
