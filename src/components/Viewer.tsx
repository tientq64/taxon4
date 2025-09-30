import { memo, ReactNode, RefObject, useEffect, useState, WheelEvent } from 'react'
import { Taxon } from '../helpers/parse'
import { app, useApp } from '../store/app'
import { SearchResultMarkers } from './SearchResultMarkers'
import { TaxonRow } from './TaxonRow'

interface ViewerProps {
	scrollerRef: RefObject<HTMLDivElement>
	virtualTaxaRef: RefObject<HTMLDivElement>
}

/** Trình xem danh sách các đơn vị phân loại. */
function ViewerMemo({ scrollerRef, virtualTaxaRef }: ViewerProps): ReactNode {
	const { keyCode, virtualTaxa, searchResult } = useApp()

	const [scrollRestored, setScrollRestored] = useState<boolean>(false)

	const isFastScroll: boolean = keyCode === 'AltLeft'

	const handleScrollerScroll = (event: WheelEvent<HTMLDivElement>): void => {
		if (!scrollRestored) return
		const scrollEl = event.currentTarget
		if (isFastScroll) {
			scrollEl.scrollTop = app.scrollTop
			return
		}
		app.scrollTop = scrollEl.scrollTop
	}

	const handleScrollerWheel = (event: WheelEvent<HTMLDivElement>): void => {
		if (!scrollRestored) return
		if (!isFastScroll) return
		const scrollEl = event.currentTarget
		scrollEl.scrollTop += event.deltaY * 3
		app.scrollTop = scrollEl.scrollTop
	}

	useEffect(() => {
		setTimeout(() => {
			if (scrollRestored) return
			if (virtualTaxa.length === 0) return
			if (scrollerRef.current === null) return
			scrollerRef.current.scrollTop = app.scrollTop
			setScrollRestored(true)
		}, 50)
	}, [scrollRestored, scrollerRef, virtualTaxa])

	return (
		<main className="relative flex-1">
			<div
				ref={scrollerRef}
				className="flex h-full flex-1 overflow-auto"
				onScroll={handleScrollerScroll}
				onWheel={handleScrollerWheel}
			>
				<div ref={virtualTaxaRef} className="w-full">
					{virtualTaxa.map(({ data }) => (
						<TaxonRow key={data.index} taxon={data as Taxon} />
					))}
				</div>
			</div>
			{searchResult.length > 0 && <SearchResultMarkers />}
		</main>
	)
}

export const Viewer = memo(ViewerMemo)
