import { getTaxonEbirdUrl } from '../../src/helpers/getTaxonEbirdUrl'
import { Sites, useExtStore } from '../store/useExtStore'

export function getCurrentSearchQuery(): string | undefined {
	const sites: Sites = useExtStore.getState().sites

	let q: string | undefined
	switch (true) {
		case sites.wikipedia:
			q = $('.biota .binomial').first().clone().find('.reference').remove().end().text()
			q ||= $('#firstHeading').first().text()
			break

		case sites.wikispecies:
			q = document
				.querySelector<HTMLAnchorElement>('.wb-otherproject-species > a')!
				.href.split('/')
				.at(-1)
			break

		case sites.flickr:
			q = document.querySelector<HTMLInputElement>('#search-field')!.value
			break

		case sites.inaturalistSearch:
			q = document.querySelector<HTMLInputElement>('#q')!.value
			break

		case sites.inaturalistTaxon:
			q = document.querySelector<HTMLElement>('#TaxonHeader .sciname')!.innerText
			break

		case sites.herpmapper:
			q = location.pathname.split('/').at(-1)!
			break

		case sites.ebird:
			q = document.querySelector<HTMLSpanElement>('.Heading-sub--sci')!.innerText
			break
	}
	if (!q) return

	q = encodeURI(q.trim())
	return q
}

export function switchToPage(pageName: keyof Sites): void
export function switchToPage(pageName: 'inaturalistTaxon', isCommonName?: boolean): void

export async function switchToPage(pageName: keyof Sites, ...args: unknown[]): Promise<void> {
	let url: string | undefined = undefined

	let q: string | undefined = getCurrentSearchQuery()
	if (q === undefined) return

	switch (pageName) {
		case 'wikipedia':
			url = `https://en.wikipedia.org/wiki/${q}`
			break

		case 'wikispecies':
			url = `https://species.wikimedia.org/wiki/${q}`
			break

		case 'flickr':
			url = `https://www.flickr.com/search/?text=${q}`
			break

		case 'inaturalistSearch':
			url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}`
			break

		case 'inaturalistTaxon':
			{
				const isCommonNameQuery: string = args[0] ? '&isCommonName' : ''
				url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}${isCommonNameQuery}`
			}
			break

		case 'herpmapper':
			url = `https://herpmapper.org/taxon/${q}`
			break

		case 'ebird':
			for (let i = 0; i < 2; i++) {
				if (i === 1) {
					q = document.querySelector<HTMLElement>('.mw-page-title-main')?.innerText
				}
				if (q === undefined) break
				url = await getTaxonEbirdUrl(q)
				if (url) break
			}
			break
	}
	if (!url) {
		useExtStore.getState().showToast('Không tìm thấy URL')
		return
	}

	location.href = url
}
