import { useEventListener, useVirtualList } from 'ahooks'
import { countBy } from 'lodash-es'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { LanguageFloatingButton } from '../components/LanguageFloatingButton'
import { LoadScreen } from '../components/LoadScreen'
import { Minimap } from '../components/Minimap'
import { PanelsSide } from '../components/PanelsSide'
import { SearchPopup } from '../components/SearchPopup'
import { Viewer } from '../components/Viewer'
import { lastRank, Ranks } from '../constants/ranks'
import { getActiveTaxonFromVirtualTaxa } from '../helpers/getActiveTaxonFromVirtualTaxa'
import { Taxon } from '../helpers/parse'
import { useAppKeyDown } from '../hooks/useAppKeyDown'
import { useLanguageUpdate } from '../hooks/useLanguageUpdate'
import { useRankLevelWidthUpdate } from '../hooks/useRankLevelWidthUpdate'
import { app, useApp } from '../store/app'
import { ref } from '../utils/ref'

export type VirtualTaxon = {
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
		minimapVisible
	} = useApp()

	const scrollerRef = useRef<HTMLDivElement>(null)
	const virtualTaxaRef = useRef<HTMLDivElement>(null)

	const [virtualTaxa, scrollTo] = useVirtualList(filteredTaxa as Taxon[], {
		containerTarget: scrollerRef,
		wrapperTarget: virtualTaxaRef,
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
	useEventListener('keyup', () => {
		app.keyCode = ''
	})

	// Xử lý khi tab mất tập trung.
	useEventListener('blur', () => {
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
		let filteredTaxa: Taxon[]
		if (maxRankLevelShown === lastRank.level) {
			filteredTaxa = taxa as Taxon[]
		} else {
			filteredTaxa = taxa.filter((taxon) => {
				return taxon.rank.level <= maxRankLevelShown
			}) as Taxon[]
		}
		filteredTaxa.forEach((taxon, i) => {
			taxon.filteredIndex = i
		})
		app.filteredTaxa = ref(filteredTaxa)
	}, [taxa, maxRankLevelShown])

	useEffect(() => {
		app.activeTaxon = ref(getActiveTaxonFromVirtualTaxa(virtualTaxa))
	}, [virtualTaxa, linesOverscan])

	useEffect(() => {
		app.virtualTaxa = ref(virtualTaxa)
		app.scrollToTaxon = ref(scrollToTaxon)
	}, [virtualTaxa, scrollToTaxon])

	useRankLevelWidthUpdate()
	useLanguageUpdate()

	return (
		<div className="h-full">
			{taxa.length === 0 && <LoadScreen />}

			{taxa.length > 0 && (
				<div className="flex h-full">
					<PanelsSide />
					<Viewer scrollerRef={scrollerRef} virtualTaxaRef={virtualTaxaRef} />
					{minimapVisible && <Minimap />}

					{isSearchPopupVisible && <SearchPopup />}
					<LanguageFloatingButton />
				</div>
			)}
		</div>
	)
}
