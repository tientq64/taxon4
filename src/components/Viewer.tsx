import { memo, ReactNode, RefObject, useContext, useEffect, useState, WheelEvent } from 'react'
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
	const keyCode = useAppStore((state) => state.keyCode)
	const setScrollTop = useAppStore((state) => state.setScrollTop)

	const subTaxa = useContext(SubTaxaContext)!
	const [scrollRestored, setScrollRestored] = useState<boolean>(false)

	const isFastScroll: boolean = keyCode === 'AltLeft'

	const handleScrollerScroll = (event: WheelEvent<HTMLDivElement>): void => {
		if (!scrollRestored) return
		const scrollEl = event.currentTarget
		if (isFastScroll) {
			scrollEl.scrollTop = useAppStore.getState().scrollTop
			return
		}
		setScrollTop(scrollEl.scrollTop)
	}

	const handleScrollerWheel = (event: WheelEvent<HTMLDivElement>): void => {
		if (!scrollRestored) return
		if (!isFastScroll) return
		const scrollEl = event.currentTarget
		scrollEl.scrollTop += event.deltaY * 3
		setScrollTop(scrollEl.scrollTop)
	}

	useEffect(() => {
		setTimeout(() => {
			if (scrollRestored) return
			if (subTaxa.length === 0) return
			if (scrollerRef.current === null) return
			scrollerRef.current.scrollTop = useAppStore.getState().scrollTop
			setScrollRestored(true)
		}, 50)
	}, [scrollRestored, scrollerRef, subTaxa.length])

	return (
		<main className="relative flex-1">
			<div
				ref={scrollerRef}
				className="flex h-full flex-1 overflow-auto"
				onScroll={handleScrollerScroll}
				onWheel={handleScrollerWheel}
			>
				<div ref={subTaxaRef} className="w-full">
					{subTaxa.map(({ data: taxon, index }) => (
						<TaxonRow key={taxon.index} taxon={taxon} index={index} />
					))}
				</div>
			</div>
		</main>
	)
})
