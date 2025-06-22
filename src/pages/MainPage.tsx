import { useEventListener, useVirtualList } from 'ahooks'
import { countBy } from 'lodash-es'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { lastRank, Ranks } from '../../web-extension/constants/Ranks'
import { LoadScreen } from '../components/LoadScreen'
import { Minimap } from '../components/Minimap'
import { PanelsSide } from '../components/PanelsSide'
import { PopupLanguageFloatingButton } from '../components/PopupLanguageFloatingButton'
import { SearchPopup } from '../components/SearchPopup'
import { Viewer } from '../components/Viewer'
import { getAutoCurrentTaxon } from '../helpers/getAutoCurrentTaxon'
import { Taxon } from '../helpers/parse'
import { useAppKeyDown } from '../hooks/useAppKeyDown'
import { useLanguageUpdate } from '../hooks/useLanguageUpdate'
import { useRankLevelWidthUpdate } from '../hooks/useRankLevelWidthUpdate'
import { app, useApp } from '../store/useAppStore'
import { ref } from '../utils/ref'

export type SubTaxon = {
	index: number
	data: Taxon
}

export type ScrollToTaxon = (taxon: Taxon) => void

export function MainPage(): ReactNode {
	const {
		taxa,
		lineHeight,
		linesOverscan,
		filteredTaxa,
		maxRankLevelShown,
		isSearchPopupVisible,
		minimapShown
	} = useApp()

	const scrollerRef = useRef<HTMLDivElement>(null)
	const subTaxaRef = useRef<HTMLDivElement>(null)

	const [subTaxa, scrollTo] = useVirtualList(filteredTaxa as Taxon[], {
		containerTarget: scrollerRef,
		wrapperTarget: subTaxaRef,
		itemHeight: lineHeight,
		overscan: linesOverscan
	})

	/** Cuộn đến đơn vị phân loại xác định. */
	const scrollToTaxon: ScrollToTaxon = useCallback(
		(taxon) => {
			let index: number = taxon.index
			if (filteredTaxa.length < taxa.length) {
				index = filteredTaxa.findIndex((filteredTaxon) => {
					return filteredTaxon.index === taxon.index
				})
				if (index === -1) return
			}
			scrollTo(index)
		},
		[filteredTaxa, scrollTo, taxa.length]
	)

	// Xử lý khi nhấn phím.
	useAppKeyDown()

	// Xử lý khi nhả phím.
	useEventListener('keyup', (): void => {
		app.keyCode = ''
	})

	// Xử lý khi tab mất tập trung.
	useEventListener('blur', (): void => {
		app.keyCode = ''
	})

	// Thực hiện đếm số lượng đơn vị phân loại dựa trên bậc phân loại.
	useEffect(() => {
		const counts: Record<string, number> = countBy(taxa, 'rank.name')
		for (const rank of Ranks) {
			counts[rank.name] ??= 0
		}
		app.taxaCountByRankNames = ref(counts)
	}, [taxa])

	// Tạo danh sách đơn vị phân loại được lọc theo bậc phân loại tối đa được hiển thị.
	useEffect(() => {
		if (maxRankLevelShown === lastRank.level) {
			app.filteredTaxa = ref(taxa) as Taxon[]
		} else {
			app.filteredTaxa = ref(
				taxa.filter((taxon) => {
					return taxon.rank.level <= maxRankLevelShown
				})
			) as Taxon[]
		}
	}, [taxa, maxRankLevelShown])

	useEffect(() => {
		app.currentTaxon = ref(getAutoCurrentTaxon(subTaxa))
	}, [subTaxa, linesOverscan])

	useEffect(() => {
		app.subTaxa = ref(subTaxa)
		app.scrollToTaxon = ref(scrollToTaxon)
	}, [subTaxa, scrollToTaxon])

	// Cập nhật độ rộng thụt lề khi kích thước cửa sổ thay đổi.
	useRankLevelWidthUpdate()

	useLanguageUpdate()

	return (
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
	)
}
