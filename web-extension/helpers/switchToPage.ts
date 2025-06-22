import { getTaxonEbirdUrl } from '../../src/helpers/getTaxonEbirdUrl'
import { ext, SiteName } from '../store/ext'
import { $ } from '../utils/jquery'
import { showToast } from './showToast'

export function getCurrentSearchQuery(): string | undefined {
	const { sites } = ext

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
			q = location.pathname.split('/').at(-1)
			break

		case sites.repfocus:
			q = location.pathname.split('/').at(-1)?.split('.').at(0)
			break

		case sites.ebird:
			q = document.querySelector<HTMLSpanElement>('.Heading-sub--sci')!.innerText
			break

		case sites.googleImage:
			q = document.querySelector<HTMLTextAreaElement>('textarea[name=q]')!.value
			break

		case sites.sealifebase:
			q = document.querySelector<HTMLElement>('.pheader > i')!.innerText
			break
	}
	if (!q) return

	q = encodeURI(q.trim())
	return q
}

export function switchToPage(pageName: SiteName): void
export function switchToPage(pageName: SiteName.InaturalistTaxon, isCommonName?: boolean): void

export async function switchToPage(pageName: SiteName, ...args: unknown[]): Promise<void> {
	let url: string | undefined = undefined

	let q: string | undefined = getCurrentSearchQuery()
	if (q === undefined) return

	switch (pageName) {
		case SiteName.Wikipedia:
			url = `https://en.wikipedia.org/wiki/${q}`
			break

		case SiteName.Wikispecies:
			url = `https://species.wikimedia.org/wiki/${q}`
			break

		case SiteName.Flickr:
			url = `https://www.flickr.com/search/?text=${q}`
			break

		case SiteName.InaturalistSearch:
			url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}`
			break

		case SiteName.InaturalistTaxon:
			{
				const isCommonNameQuery: string = args[0] ? '&isCommonName' : ''
				url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}${isCommonNameQuery}`
			}
			break

		case SiteName.Herpmapper:
			// url = `https://herpmapper.org/taxon/${q}`
			// url = `https://translate.google.com.vn/?hl=vi&sl=en&tl=vi&text=${url}`
			url = `https://herpmapper-org.translate.goog/taxon/${q}?_x_tr_sl=en&_x_tr_tl=vi&_x_tr_hl=vi`
			break

		case SiteName.Repfocus:
			url = `https://repfocus.dk/${q}.html`
			break

		case SiteName.Ebird:
			for (let i = 0; i < 2; i++) {
				if (i === 1) {
					q = document.querySelector<HTMLElement>('.mw-page-title-main')?.innerText
				}
				if (q === undefined) break
				url = await getTaxonEbirdUrl(q)
				if (url) break
			}
			break

		case SiteName.GoogleImage:
			url = `https://www.google.com/search?q=${q}&udm=2`
			break

		case SiteName.SeaLifeBase:
			url = `https://www.sealifebase.se/Nomenclature/SpeciesList.php?genus=${q}`
			break
	}
	if (!url) {
		showToast('Không tìm thấy URL')
		return
	}

	location.href = url
}
