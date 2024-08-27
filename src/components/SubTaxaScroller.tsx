import { ReactNode, useContext, useEffect, WheelEvent } from 'react'
import { AppContext } from '../App'
import { TaxonNode } from './TaxonNode'

export function SubTaxaScroller(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { subTaxa, scrollTop, setScrollTop, scrollerRef, subTaxaRef } = store

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
				{subTaxa.map(({ data: taxon }) => (
					<TaxonNode key={taxon.index} taxon={taxon} />
				))}
			</div>
		</div>
	)
}
