import { proxy, Snapshot, useSnapshot } from 'valtio'
import { matchUrl } from '../helpers/matchUrl'
import { Toast } from '../helpers/showToast'

export enum SiteName {
	Wikipedia = 'wikipedia',
	Wikispecies = 'wikispecies',
	Flickr = 'flickr',
	Inaturalist = 'inaturalist',
	InaturalistSearch = 'inaturalistSearch',
	InaturalistTaxon = 'inaturalistTaxon',
	Herpmapper = 'herpmapper',
	Herplist = 'herplist',
	Repfocus = 'repfocus',
	Ebird = 'ebird',
	GoogleImage = 'googleImage',
	SeaLifeBase = 'sealifebase',
	FishBase = 'fishbase'
}

export type Sites = Record<SiteName, boolean>

export const initialComboKeys: string[] = ['', '', '']

export interface Ext {
	sites: Sites
	comboKeys: string[]
	mouseDownSel: string
	hasSubspecies: boolean
	gitHubUploadImageUrl: string | undefined
	toasts: Toast[]
}

export const ext = proxy<Ext>({
	sites: {
		[SiteName.Wikipedia]: matchUrl('https://^+.wikipedia.org/wiki/^+'),
		[SiteName.Wikispecies]: matchUrl('https://species.wikimedia.org/wiki/^+'),
		[SiteName.Flickr]: matchUrl('https://www.flickr.com/^*'),
		[SiteName.Inaturalist]: matchUrl('https://www.inaturalist.org/^+'),
		[SiteName.InaturalistSearch]: matchUrl('https://www.inaturalist.org/taxa/search^+'),
		[SiteName.InaturalistTaxon]: matchUrl('https://www.inaturalist.org/taxa/\\d+-^+'),
		[SiteName.Herpmapper]:
			matchUrl('https://herpmapper.org/taxon/^+') ||
			matchUrl('https://herpmapper-org.translate.goog/taxon/^+'),
		[SiteName.Herplist]: matchUrl('https://herplist.org/'),
		[SiteName.Repfocus]: matchUrl('https://repfocus.dk/^+.html'),
		[SiteName.Ebird]: matchUrl('https://ebird.org/species/^+'),
		[SiteName.GoogleImage]: matchUrl('https://www.google.com/search^+'),
		[SiteName.SeaLifeBase]: matchUrl('https://www.sealifebase.se/^+'),
		[SiteName.FishBase]: matchUrl('https://fishbase.mnhn.fr/^+')
	},
	comboKeys: [...initialComboKeys],
	mouseDownSel: '',
	hasSubspecies: false,
	gitHubUploadImageUrl: undefined,
	toasts: []
})

export function useExt(): Snapshot<Ext> {
	return useSnapshot(ext)
}
