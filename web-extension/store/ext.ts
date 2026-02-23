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
	Herplist = 'herplist',
	Repfocus = 'repfocus',
	Ebird = 'ebird',
	GoogleImage = 'googleImage',
	SeaLifeBase = 'sealifebase',
	FishBase = 'fishbase',
	InfluentialPoints = 'influentialpoints'
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
		[SiteName.Flickr]: matchUrl('https://flickr.com/^*'),
		[SiteName.Inaturalist]: matchUrl('https://inaturalist.org/^+'),
		[SiteName.InaturalistSearch]: matchUrl('https://inaturalist.org/taxa/search^+'),
		[SiteName.InaturalistTaxon]: matchUrl('https://inaturalist.org/taxa/\\d+-^+'),
		[SiteName.Herplist]: matchUrl('https://herplist.org/'),
		[SiteName.Repfocus]: matchUrl('https://repfocus.dk/^+.html'),
		[SiteName.Ebird]: matchUrl('https://ebird.org/species/^+'),
		[SiteName.GoogleImage]: matchUrl('https://google.com/search^+'),
		[SiteName.SeaLifeBase]: matchUrl('https://sealifebase.se/^+'),
		[SiteName.FishBase]: matchUrl('https://fishbase.mnhn.fr/^+'),
		[SiteName.InfluentialPoints]: matchUrl('https://influentialpoints.com/^+')
	},
	comboKeys: [...initialComboKeys],
	mouseDownSel: '',
	hasSubspecies: false,
	gitHubUploadImageUrl: undefined,
	toasts: []
})

export function useExt(sync?: boolean): Snapshot<Ext> {
	return useSnapshot(ext, { sync })
}
