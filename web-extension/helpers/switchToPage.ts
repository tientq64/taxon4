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
	}
	if (q === undefined) return

	q = encodeURI(q.trim())
	return q
}

export function getSwitchToPageUrl(pageName: keyof Sites): string | undefined {
	let q: string | undefined = getCurrentSearchQuery()
	if (q === undefined) return

	let url: string | undefined = undefined
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
	}
	if (url === undefined) return

	return url
}

export function switchToPage(pageName: keyof Sites): void {
	const url: string | undefined = getSwitchToPageUrl(pageName)
	if (url === undefined) return

	location.href = url
}
