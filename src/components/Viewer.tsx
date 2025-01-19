import { memo, ReactNode, RefObject, useCallback, useContext, useEffect, WheelEvent } from 'react'
import { SubTaxaContext } from '../App'
import { useAppStore } from '../store/useAppStore'
import { TaxonRow } from './TaxonRow'

interface Props {
	scrollerRef: RefObject<HTMLDivElement>
	subTaxaRef: RefObject<HTMLDivElement>
}

/**
 * Trình xem danh sách các đơn vị phân loại.
 */
export const Viewer = memo(function ({ scrollerRef, subTaxaRef }: Props): ReactNode {
	const scrollTop = useAppStore((state) => state.scrollTop)
	const setScrollTop = useAppStore((state) => state.setScrollTop)
	const keyCode = useAppStore((state) => state.keyCode)

	const subTaxa = useContext(SubTaxaContext)!

	const handleScrollerScroll = useCallback(
		(event: WheelEvent<HTMLDivElement>): void => {
			setScrollTop(event.currentTarget.scrollTop)
		},
		[setScrollTop]
	)

	const handleFastScrollerWheel = useCallback(
		(event: WheelEvent<HTMLDivElement>): void => {
			if (keyCode !== 'AltLeft') return
			if (scrollerRef.current === null) return
			scrollerRef.current.scrollTop += event.deltaY * 3
		},
		[keyCode, scrollerRef]
	)

	useEffect(() => {
		requestAnimationFrame(() => {
			if (subTaxa.length === 0) return
			if (scrollerRef.current === null) return
			scrollerRef.current.scrollTop = scrollTop
		})
	}, [scrollTop, scrollerRef, subTaxa.length])

	return (
		<main className="relative flex-1">
			<div
				ref={scrollerRef}
				className="flex h-full flex-1 overflow-auto"
				onScroll={handleScrollerScroll}
			>
				<div ref={subTaxaRef} className="w-full">
					{subTaxa.map(({ data: taxon, index }) => (
						<TaxonRow key={taxon.index} taxon={taxon} index={index} />
					))}
				</div>
			</div>

			{keyCode === 'AltLeft' && (
				<div className="absolute inset-0" onWheel={handleFastScrollerWheel}></div>
			)}
		</main>
	)
})
