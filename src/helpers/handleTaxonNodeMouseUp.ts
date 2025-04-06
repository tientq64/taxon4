import { MouseEvent } from 'react'
import { copyText } from '../../web-extension/utils/clipboard'
import { ScrollTo } from '../App'
import { useAppStore } from '../store/useAppStore'
import { openUrl } from '../utils/openUrl'
import { getTaxonEbirdUrl } from './getTaxonEbirdUrl'
import { getTaxonFullName } from './getTaxonFullName'
import { getTaxonQueryName } from './getTaxonQueryName'
import { getTaxonWikipediaQueryName } from './getTaxonWikipediaQueryName'
import { Taxon } from './parse'

export async function handleTaxonNodeMouseUp(
	event: MouseEvent<HTMLDivElement>,
	taxon: Taxon,
	scrollTo: ScrollTo
): Promise<void> {
	event.preventDefault()

	const keyCode = useAppStore.getState().keyCode

	const button: number = event.button
	let url: string | undefined
	let q: string = getTaxonQueryName(taxon)

	switch (button) {
		case 0:
			{
				if (event.ctrlKey) {
					scrollTo(taxon)
				} else {
					switch (keyCode) {
						case 'KeyN':
							url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}`
							break
						case 'KeyM':
							url = `https://herpmapper.org/taxon/${q}`
							url = `https://translate.google.com.vn/?hl=vi&sl=en&tl=vi&text=${url}`
							// url = `https://herpmapper-org.translate.goog/taxon/${q}?_x_tr_sl=vi&_x_tr_tl=en&_x_tr_hl=vi`
							break
						case 'KeyR':
							url = `https://repfocus.dk/${q}.html`
							break
						case 'KeyE':
							url = await getTaxonEbirdUrl(q)
							break
						default:
							const lang: string = event.altKey ? 'vi' : 'en'
							q = getTaxonWikipediaQueryName(taxon, lang)
							url = `https://${lang}.wikipedia.org/wiki/${q}`
							break
					}
					openUrl(url)
				}
			}
			break

		case 1:
			{
				switch (keyCode) {
					case 'KeyC':
						const fullName: string = getTaxonFullName(taxon)
						copyText(fullName)
						break
					default:
						if (event.altKey) {
							url = `https://www.google.com/search?q=${q}+common+name`
						} else {
							url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}&isCommonName`
						}
						break
				}
				openUrl(url)
			}
			break

		case 2:
			{
				if (event.altKey) {
					url = `https://www.google.com/search?q=${q}&udm=2`
				} else {
					url = `https://www.flickr.com/search/?text=${q}`
				}
				openUrl(url)
			}
			break
	}
}
