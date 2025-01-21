import { useRequest } from 'ahooks'
import { fetchHeaders } from '../helpers/fetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'

async function getWikipediaSummary(
	taxonOrQuery: Taxon | string,
	languageCode: string,
	includeTitle?: boolean
): Promise<string | null> {
	let query: string
	if (typeof taxonOrQuery === 'string') {
		query = taxonOrQuery
	} else {
		query = getTaxonWikipediaQueryName(taxonOrQuery, languageCode)
	}

	const res: Response = await fetch(
		`https://${languageCode}.wikipedia.org/api/rest_v1/page/summary/${query}`,
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
	const shouldRemoveEls = dom.querySelectorAll<HTMLSpanElement>('span.tfd')
	for (const el of shouldRemoveEls) {
		el.remove()
	}
	if (paragraphEl === null) return null

	summary = paragraphEl.innerHTML
	summary = summary.replace(/:$/, '.')

	if (includeTitle) {
		const title: string = data.title
		summary = `<div class="taxon4-title mb-4 border-b border-gray-500 font-serif !text-2xl">${title}</div>${summary}`
	}

	return summary
}

export function useGetWikipediaSummary() {
	const request = useRequest(getWikipediaSummary, {
		manual: true
	})
	return request
}
