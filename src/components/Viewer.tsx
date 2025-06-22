import { memo, ReactNode, RefObject, useEffect, useState, WheelEvent } from 'react'
import { Taxon } from '../helpers/parse'
import { app, useApp } from '../store/useAppStore'
import { TaxonRow } from './TaxonRow'

interface ViewerProps {
	scrollerRef: RefObject<HTMLDivElement>
	subTaxaRef: RefObject<HTMLDivElement>
}

/** Trình xem danh sách các đơn vị phân loại. */
function ViewerMemo({ scrollerRef, subTaxaRef }: ViewerProps): ReactNode {
	const { keyCode, subTaxa } = useApp()

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
			if (subTaxa.length === 0) return
			if (scrollerRef.current === null) return
			scrollerRef.current.scrollTop = app.scrollTop
			setScrollRestored(true)
		}, 50)
	}, [scrollRestored, scrollerRef, subTaxa])

	return (
		<main className="relative flex-1">
			<div
				ref={scrollerRef}
				className="flex h-full flex-1 overflow-auto"
				onScroll={handleScrollerScroll}
				onWheel={handleScrollerWheel}
			>
				<div ref={subTaxaRef} className="w-full">
					{subTaxa.map(({ data, index }) => (
						<TaxonRow key={data.index} taxon={data as Taxon} index={index} />
					))}
				</div>
			</div>
		</main>
	)
}

export const Viewer = memo(ViewerMemo)
