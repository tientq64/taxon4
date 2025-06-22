import { fetchHeaders } from '../helpers/fetchHeaders'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { Taxon } from '../helpers/parse'
import { parseHtml } from '../utils/parseHtml'

export async function getWikipediaSummary(
	taxonOrQuery: Taxon | string,
	languageCode: string,
	includeTitle?: boolean
): Promise<string | null> {
	let q: string
	if (typeof taxonOrQuery === 'string') {
		q = taxonOrQuery
	} else {
		q = getTaxonWikipediaQueryName(taxonOrQuery, languageCode)
	}
	if (q === '/') return null

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

	const dom: Document = parseHtml(summary)
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
		summary = `<div class="taxon4-title mb-4 border-b border-gray-500 font-serif text-2xl!">${title}</div>${summary}`
	}

	return summary
}
