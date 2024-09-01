import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { lastRank } from '../../web-extension/models/Ranks'
import { Taxon } from '../helpers/parse'
import { popupLanguages } from '../models/popupLanguages'
import { find } from 'lodash-es'

export type Store = {
	taxa: Taxon[]
	setTaxa: (taxa: Taxon[]) => void
	rankLevelWidth: number
	setRankLevelWidth: (rankLevelWidth: number) => void
	scrollTop: number
	setScrollTop: (scrollTop: number) => void
	currentPanelName: string
	setCurrentPanelName: (currentPanelName: string) => void
	filteredTaxa: Taxon[]
	setFilteredTaxa: (filteredTaxa: Taxon[]) => void
	currentTaxon: Taxon | undefined
	setCurrentTaxon: (currentTaxon: Taxon | undefined) => void
	linesOverscan: number
	lineHeight: number
	popupLanguageCode: string
	setPopupLanguageCode: (popupLanguageCode: string) => void
	taxaCountByRankNames: Record<string, number>
	setTaxaCountByRankNames: (taxaCountByRankNames: Record<string, number>) => void
	maxRankLevelShown: number
	setMaxRankLevelShown: (maxRankLevelShown: number) => void
	keyCode: string
	setKeyCode: (keyCode: string) => void
}

export const useStore = create<Store, [['zustand/persist', Partial<Store>]]>(
	persist(
		(set) => ({
			taxa: [],
			setTaxa: (taxa) => set({ taxa }),
			rankLevelWidth: 16,
			setRankLevelWidth: (rankLevelWidth) => set({ rankLevelWidth }),
			scrollTop: 0,
			setScrollTop: (scrollTop) => set({ scrollTop }),
			currentPanelName: 'classification',
			setCurrentPanelName: (currentPanelName) => set({ currentPanelName }),
			filteredTaxa: [],
			setFilteredTaxa: (filteredTaxa) => set({ filteredTaxa }),
			currentTaxon: undefined,
			setCurrentTaxon: (currentTaxon) => set({ currentTaxon }),
			linesOverscan: 10,
			lineHeight: 24,
			popupLanguageCode: find(popupLanguages, { code: navigator.language })?.code ?? 'en',
			setPopupLanguageCode: (popupLanguageCode) => set({ popupLanguageCode }),
			taxaCountByRankNames: {},
			setTaxaCountByRankNames: (taxaCountByRankNames) => set({ taxaCountByRankNames }),
			maxRankLevelShown: lastRank.level,
			setMaxRankLevelShown: (maxRankLevelShown) => set({ maxRankLevelShown }),
			keyCode: '',
			setKeyCode: (keyCode) => set({ keyCode })
		}),
		{
			name: 'tientq64/taxon4',
			partialize: (state) => ({
				scrollTop: state.scrollTop,
				popupLanguageCode: state.popupLanguageCode,
				maxRankLevelShown: state.maxRankLevelShown
			})
		}
	)
)
