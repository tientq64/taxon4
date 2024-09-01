import { memo, ReactNode, useContext, useEffect, WheelEvent } from 'react'
import { AppContext } from '../App'
import { useStore } from '../store/useStore'
import { TaxonNode } from './TaxonNode'

export const SubTaxaScroller = memo(function (): ReactNode {
	const scrollTop = useStore((state) => state.scrollTop)
	const setScrollTop = useStore((state) => state.setScrollTop)
	const { subTaxa, scrollerRef, subTaxaRef } = useContext(AppContext)!

	const handleScrollerScroll = (event: WheelEvent<HTMLDivElement>): void => {
		setScrollTop(event.currentTarget.scrollTop)
	}

	useEffect(() => {
		requestAnimationFrame(() => {
			if (subTaxa.length === 0) return
			if (scrollerRef.current === null) return
			scrollerRef.current.scrollTop = scrollTop
		})
	}, [subTaxa.length > 0, scrollerRef])

	return (
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
	)
})
