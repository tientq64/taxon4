import { useEventListener, useVirtualList } from 'ahooks'
import { countBy } from 'lodash-es'
import { createContext, ReactNode, useCallback, useEffect, useRef } from 'react'
import { lastRank, Ranks } from '../../web-extension/constants/Ranks'
import { LoadScreen } from '../components/LoadScreen'
import { Minimap } from '../components/Minimap'
import { PanelsSide } from '../components/PanelsSide'
import { PopupLanguageFloatingButton } from '../components/PopupLanguageFloatingButton'
import { SearchPopup } from '../components/SearchPopup'
import { Viewer } from '../components/Viewer'
import { Taxon } from '../helpers/parse'
import { useAppKeyDown } from '../hooks/useAppKeyDown'
import { useUpdateRankLevelWidth } from '../hooks/useUpdateRankLevelWidth'
import { useAppStore } from '../store/useAppStore'

export type SubTaxon = {
	index: number
	data: Taxon
}

export type ScrollTo = (taxon: Taxon) => void

export const SubTaxaContext = createContext<SubTaxon[]>([])
export const ScrollToContext = createContext<ScrollTo>(() => {})

export function MainPage(): ReactNode {
	const taxa = useAppStore((state) => state.taxa)
	const lineHeight = useAppStore((state) => state.lineHeight)
	const linesOverscan = useAppStore((state) => state.linesOverscan)
	const filteredTaxa = useAppStore((state) => state.filteredTaxa)
	const maxRankLevelShown = useAppStore((state) => state.maxRankLevelShown)
	const isSearchPopupVisible = useAppStore((state) => state.isSearchPopupVisible)
	const minimapShown = useAppStore((state) => state.minimapShown)

	const setFilteredTaxa = useAppStore((state) => state.setFilteredTaxa)
	const setCurrentTaxon = useAppStore((state) => state.setCurrentTaxon)
	const setTaxaCountByRankNames = useAppStore((state) => state.setTaxaCountByRankNames)
	const setKeyCode = useAppStore((state) => state.setKeyCode)

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
	useAppKeyDown()

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
	}, [subTaxa, linesOverscan, setCurrentTaxon])

	// Cập nhật độ rộng thụt lề khi kích thước cửa sổ thay đổi.
	useUpdateRankLevelWidth()

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
