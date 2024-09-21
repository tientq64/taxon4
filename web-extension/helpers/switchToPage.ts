import { sites, Sites } from '../App'

export function getCurrentSearchQuery(): string | undefined {
	let q: string | undefined
	switch (true) {
		case sites.wikipedia:
			{
				q = $('.biota .binomial').first().clone().find('.reference').remove().end().text()
				q ||= $('#firstHeading').first().text()
			}
			break

		case sites.flickrSearch:
			q = document.querySelector<HTMLInputElement>('#search-field')!.value
			break

		case sites.inaturalistSearch:
			q = document.querySelector<HTMLInputElement>('#q')!.value
			break

		case sites.inaturalistTaxon:
			q = document.querySelector<HTMLElement>('#TaxonHeader .sciname')!.innerText
			break
	}
	if (q === undefined) return

	q = encodeURI(q.trim())
	return q
}

export function switchToPage(pageName: keyof Sites): void
export function switchToPage(pageName: 'inaturalistTaxon', isCommonName?: boolean): void

export function switchToPage(pageName: keyof Sites, ...args: unknown[]): void {
	let url: string | undefined = undefined

	let q: string | undefined = getCurrentSearchQuery()
	if (q === undefined) return

	switch (pageName) {
		case 'wikipedia':
			url = `https://en.wikipedia.org/wiki/${q}`
			break

		case 'flickrSearch':
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
	}
	if (url === undefined) return

	location.href = url
}
