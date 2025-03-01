import { useEventListener, useUpdateEffect, useVirtualList } from 'ahooks'
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
import { lastRank, Ranks } from '../web-extension/constants/Ranks'
import { LoadScreen } from './components/LoadScreen'
import { Minimap } from './components/Minimap'
import { PanelsSide } from './components/PanelsSide'
import { PopupLanguageFloatingButton } from './components/PopupLanguageFloatingButton'
import { SearchPopup } from './components/SearchPopup'
import { Viewer } from './components/Viewer'
import { FontFace2, getFontFace } from './constants/fontFaces'
import { getTaxonParents } from './helpers/getTaxonParents'
import { Taxon } from './helpers/parse'
import { useUpdateRankLevelWidth } from './hooks/useUpdateRankLevelWidth'
import { useAppStore } from './store/useAppStore'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type SubTaxon = {
	index: number
	data: Taxon
}

export type ScrollTo = (taxon: Taxon) => void

export const SubTaxaContext = createContext<SubTaxon[] | null>(null)
export const ScrollToContext = createContext<ScrollTo | null>(null)

export function App(): ReactNode {
	const taxa = useAppStore((state) => state.taxa)
	const lineHeight = useAppStore((state) => state.lineHeight)
	const linesOverscan = useAppStore((state) => state.linesOverscan)
	const filteredTaxa = useAppStore((state) => state.filteredTaxa)
	const setFilteredTaxa = useAppStore((state) => state.setFilteredTaxa)
	const currentTaxon = useAppStore((state) => state.currentTaxon)
	const setCurrentTaxon = useAppStore((state) => state.setCurrentTaxon)
	const setTaxaCountByRankNames = useAppStore((state) => state.setTaxaCountByRankNames)
	const maxRankLevelShown = useAppStore((state) => state.maxRankLevelShown)
	const fontFaceFamily = useAppStore((state) => state.fontFaceFamily)
	const setKeyCode = useAppStore((state) => state.setKeyCode)
	const popupLanguageCode = useAppStore((state) => state.popupLanguageCode)
	const setPopupLanguageCode = useAppStore((state) => state.setPopupLanguageCode)
	const isSearchPopupVisible = useAppStore((state) => state.isSearchPopupVisible)
	const setIsSearchPopupVisible = useAppStore((state) => state.setIsSearchPopupVisible)
	const minimapShown = useAppStore((state) => state.minimapShown)
	const isDev = useAppStore((state) => state.isDev)
	const setIsDev = useAppStore((state) => state.setIsDev)

	const scrollerRef = useRef<HTMLDivElement>(null)
	const subTaxaRef = useRef<HTMLDivElement>(null)

	const [subTaxa, scrollTo2] = useVirtualList(filteredTaxa, {
		containerTarget: scrollerRef,
		wrapperTarget: subTaxaRef,
		itemHeight: lineHeight,
		overscan: linesOverscan
	})

	/**
	 * Cuộn đến đơn vị phân loại xác định.
	 */
	const scrollTo: ScrollTo = useCallback(
		(taxon) => {
			let index: number = taxon.index
			if (filteredTaxa.length < taxa.length) {
				index = filteredTaxa.indexOf(taxon)
				if (index === -1) return
			}
			scrollTo2(index)
		},
		[filteredTaxa, scrollTo2, taxa.length]
	)

	// Xử lý khi nhấn phím.
	useEventListener('keydown', (event: KeyboardEvent): void => {
		if (event.repeat) return
		if (document.activeElement?.matches('input, textarea')) return

		const code: string = event.code
		switch (code) {
			case 'KeyV':
			case 'KeyD':
				setPopupLanguageCode(popupLanguageCode === 'en' ? 'vi' : 'en')
				break

			case 'KeyF':
				event.preventDefault()
				setIsSearchPopupVisible(true)
				setKeyCode(code)
				break

			case 'KeyA':
				setIsDev(!isDev)
				break

			case 'Escape':
				setIsSearchPopupVisible(false)
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

	// Xử lý khi nhả phím.
	useEventListener('keyup', (): void => {
		setKeyCode('')
	})

	// Xử lý khi tab mất tập trung.
	useEventListener('blur', (): void => {
		setKeyCode('')
	})

	// Thực hiện đếm số lượng đơn vị phân loại dựa trên bậc phân loại.
	useEffect(() => {
		const counts: Record<string, number> = countBy(taxa, 'rank.name')
		for (const rank of Ranks) {
			counts[rank.name] ??= 0
		}
		setTaxaCountByRankNames(counts)
	}, [setTaxaCountByRankNames, taxa])

	// Tạo danh sách đơn vị phân loại được lọc theo bậc phân loại tối đa được hiển thị.
	useEffect(() => {
		if (maxRankLevelShown === lastRank.level) {
			setFilteredTaxa(taxa)
		} else {
			setFilteredTaxa(taxa.filter((taxon) => taxon.rank.level <= maxRankLevelShown))
		}
	}, [taxa, maxRankLevelShown, setFilteredTaxa])

	useEffect(() => {
		setCurrentTaxon(subTaxa.at(linesOverscan + 1)?.data)
	}, [subTaxa, linesOverscan])

	// Cập nhật độ rộng thụt lề khi kích thước cửa sổ thay đổi.
	useUpdateRankLevelWidth()

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
	}, [])

	useEffect(() => {
		const fontFace: FontFace2 | undefined = getFontFace(fontFaceFamily)
		if (fontFace === undefined) return
		const cssFontFamily: string = `${fontFace.family}, ${fontFace.fallbackFamilies}`
		document.body.style.fontFamily = cssFontFamily
	}, [fontFaceFamily])

	return (
		<SubTaxaContext.Provider value={subTaxa}>
			<ScrollToContext.Provider value={scrollTo}>
				<div className="h-full">
					{taxa.length === 0 && <LoadScreen />}

					{taxa.length > 0 && (
						<div className="flex h-full">
							<PanelsSide />
							<Viewer scrollerRef={scrollerRef} subTaxaRef={subTaxaRef} />
							{minimapShown && <Minimap />}

							{isSearchPopupVisible && <SearchPopup />}
							<PopupLanguageFloatingButton />
						</div>
					)}
				</div>
			</ScrollToContext.Provider>
		</SubTaxaContext.Provider>
	)
}
