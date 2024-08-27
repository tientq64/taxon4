import { useRequest } from 'ahooks'
import { Taxon } from '../helpers/parse'
import { getTaxonFullName } from '../helpers/getTaxonFullName'

export function useGetWikipediaSummary() {
	const request = useRequest(
		async (taxon: Taxon): Promise<string> => {
			let q: string = getTaxonFullName(taxon)
			q = q.replace(/ \(.+?\)/, '')

			let disamb: string | undefined = taxon.disambEn
			if (disamb) {
				if (disamb[0] === '/') {
					q = disamb.substring(1)
				} else {
					q += `_(${disamb})`
				}
			}
			q = encodeURIComponent(q)

			const data: any = await (
				await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${q}`)
			).json()

			let summary: string = data.extract_html

			return summary
		},
		{
			manual: true
		}
	)
	return request
}
