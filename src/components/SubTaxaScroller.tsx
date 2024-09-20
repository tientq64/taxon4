import { memo, ReactNode, useContext, useEffect, WheelEvent } from 'react'
import { AppContext } from '../App'
import { useStore } from '../store/useStore'
import { TaxonNode } from './TaxonNode'

export const SubTaxaScroller = memo(function (): ReactNode {
	const scrollTop = useStore((state) => state.scrollTop)
	const setScrollTop = useStore((state) => state.setScrollTop)
	const keyCode = useStore((state) => state.keyCode)

	const { subTaxa, scrollerRef, subTaxaRef } = useContext(AppContext)!

	const handleScrollerScroll = (event: WheelEvent<HTMLDivElement>): void => {
		setScrollTop(event.currentTarget.scrollTop)
	}

	const handleFastScrollerWheel = (event: WheelEvent<HTMLDivElement>): void => {
		if (keyCode !== 'AltLeft') return
		if (scrollerRef.current === null) return
		scrollerRef.current.scrollTop += event.deltaY * 3
	}

	useEffect(() => {
		requestAnimationFrame(() => {
			if (subTaxa.length === 0) return
			if (scrollerRef.current === null) return
			scrollerRef.current.scrollTop = scrollTop
		})
	}, [subTaxa.length > 0, scrollerRef])

	return (
		<div className="relative flex-1">
			<div
				ref={scrollerRef}
				className="flex-1 flex h-full overflow-auto"
				onScroll={handleScrollerScroll}
			>
				<div ref={subTaxaRef} className="w-full">
					{subTaxa.map(({ data: taxon, index }) => (
						<TaxonNode key={taxon.index} taxon={taxon} index={index} />
					))}
				</div>
			</div>

			{keyCode === 'AltLeft' && (
				<div className="absolute inset-0" onWheel={handleFastScrollerWheel}></div>
			)}
		</div>
	)
})
