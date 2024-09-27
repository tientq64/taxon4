import './helpers/globalConfig'

import { useEventListener, useResponsive, useUpdateEffect, useVirtualList } from 'ahooks'
import { countBy } from 'lodash-es'
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useEffect,
	useRef
} from 'react'
import { lastRank, Ranks } from '../web-extension/models/Ranks'
import { PanelsSide } from './components/PanelsSide'
import { PopupLanguageFloatingButton } from './components/PopupLanguageFloatingButton'
import { SearchPopup } from './components/SearchPopup'
import { SubTaxaScroller } from './components/SubTaxaScroller'
import { TaxaLoader } from './components/TaxaLoader'
import { getTaxonParents } from './helpers/getTaxonParents'
import { Taxon } from './helpers/parse'
import { useWindowSize } from './hooks/useWindowSize'
import { useStore } from './store/useStore'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type SubTaxon = {
	index: number
	data: Taxon
}

export type ScrollTo = (taxon: Taxon) => void

export const SubTaxaContext = createContext<SubTaxon[] | null>(null)
export const ScrollToContext = createContext<ScrollTo | null>(null)

export function App(): ReactNode {
	const taxa = useStore((state) => state.taxa)
	const setRankLevelWidth = useStore((state) => state.setRankLevelWidth)
	const lineHeight = useStore((state) => state.lineHeight)
	const linesOverscan = useStore((state) => state.linesOverscan)
	const filteredTaxa = useStore((state) => state.filteredTaxa)
	const setFilteredTaxa = useStore((state) => state.setFilteredTaxa)
	const currentTaxon = useStore((state) => state.currentTaxon)
	const setCurrentTaxon = useStore((state) => state.setCurrentTaxon)
	const setTaxaCountByRankNames = useStore((state) => state.setTaxaCountByRankNames)
	const maxRankLevelShown = useStore((state) => state.maxRankLevelShown)
	const setKeyCode = useStore((state) => state.setKeyCode)
	const popupLanguageCode = useStore((state) => state.popupLanguageCode)
	const setPopupLanguageCode = useStore((state) => state.setPopupLanguageCode)
	const isSearchPopupShown = useStore((state) => state.isSearchPopupShown)
	const setIsSearchPopupShown = useStore((state) => state.setIsSearchPopupShown)
	const isDev = useStore((state) => state.isDev)
	const setIsDev = useStore((state) => state.setIsDev)

	const scrollerRef = useRef<HTMLDivElement>(null)
	const subTaxaRef = useRef<HTMLDivElement>(null)
	const responsive = useResponsive()
	const [windowWidth] = useWindowSize()

	const [subTaxa, scrollTo2] = useVirtualList(filteredTaxa, {
		containerTarget: scrollerRef,
		wrapperTarget: subTaxaRef,
		itemHeight: lineHeight,
		overscan: linesOverscan
	})

	const scrollTo: ScrollTo = useCallback(
		(taxon) => {
			let index: number = taxon.index
			if (filteredTaxa.length < taxa.length) {
				index = filteredTaxa.indexOf(taxon)
				if (index === -1) return
			}
			scrollTo2(index)
		},
		[filteredTaxa]
	)

	useEffect(() => {
		const counts: Record<string, number> = countBy(taxa, 'rank.name')
		for (const rank of Ranks) {
			counts[rank.name] ??= 0
		}
		setTaxaCountByRankNames(counts)
	}, [taxa])

	useEffect(() => {
		if (maxRankLevelShown === lastRank.level) {
			setFilteredTaxa(taxa)
		} else {
			setFilteredTaxa(taxa.filter((taxon) => taxon.rank.level <= maxRankLevelShown))
		}
	}, [taxa, maxRankLevelShown])

	useEffect(() => {
		setCurrentTaxon(subTaxa.at(linesOverscan + 1)?.data)
	}, [subTaxa, linesOverscan])

	useEffect(() => {
		if (responsive.xxl) {
			setRankLevelWidth(16)
		} else if (responsive.xl) {
			setRankLevelWidth(8)
		} else if (responsive.lg) {
			setRankLevelWidth(4)
		} else {
			setRankLevelWidth(0)
		}
	}, [windowWidth])

	useUpdateEffect(() => {
		scrollerRef.current?.scrollTo(0, 0)
		requestAnimationFrame(() => {
			if (currentTaxon === undefined) return
			const scrolledTaxon: Taxon | undefined = getTaxonParents(currentTaxon).find(
				(taxon) => taxon.rank.level <= maxRankLevelShown
			)
			if (scrolledTaxon !== undefined) {
				scrollTo(scrolledTaxon)
			}
		})
	}, [filteredTaxa])

	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (event.repeat) return
		if (document.activeElement?.matches('input, textarea, select')) return

		const code: string = event.code

		switch (code) {
			case 'KeyV':
			case 'KeyD':
				setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
				break

			case 'KeyF':
				event.preventDefault()
				setIsSearchPopupShown(true)
				setKeyCode(code)
				break

			case 'KeyA':
				setIsDev(!isDev)
				break

			case 'Escape':
				setIsSearchPopupShown(false)
				break

			case 'AltLeft':
				event.preventDefault()
				setKeyCode(code)
				break

			default:
				setKeyCode(code)
				break
		}
	})

	useEventListener('keyup', (): void => {
		setKeyCode('')
	})

	useEventListener('blur', (): void => {
		setKeyCode('')
	})

	return (
		<SubTaxaContext.Provider value={subTaxa}>
			<ScrollToContext.Provider value={scrollTo}>
				<div className="h-full">
					{taxa.length === 0 && <TaxaLoader />}

					{taxa.length > 0 && (
						<div className="flex h-full">
							<PanelsSide />
							<SubTaxaScroller scrollerRef={scrollerRef} subTaxaRef={subTaxaRef} />

							{isSearchPopupShown && <SearchPopup />}
							<PopupLanguageFloatingButton />
						</div>
					)}
				</div>
			</ScrollToContext.Provider>
		</SubTaxaContext.Provider>
	)
}
