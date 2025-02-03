import { useVirtualList } from 'ahooks'
import { memo, ReactNode, useMemo, useRef } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useAppStore } from '../store/useAppStore'
import { TaxonRow } from './TaxonRow'

/**
 * Mục phân loại.
 */
export const ClassificationPanel = memo(function (): ReactNode {
	const currentTaxon = useAppStore((state) => state.currentTaxon)
	const lineHeight = useAppStore((state) => state.lineHeight)

	const subTaxonChildrenScrollerRef = useRef<HTMLDivElement>(null)
	const subTaxonChildrenWrapperRef = useRef<HTMLDivElement>(null)

	const taxonParents = useMemo<Taxon[]>(() => {
		if (currentTaxon === undefined) return []
		return getTaxonParents(currentTaxon).toReversed()
	}, [currentTaxon])

	const taxonChildren: Taxon[] = currentTaxon?.parent?.children ?? []

	const [subTaxonChildren] = useVirtualList(taxonChildren, {
		containerTarget: subTaxonChildrenScrollerRef,
		wrapperTarget: subTaxonChildrenWrapperRef,
		itemHeight: lineHeight,
		overscan: 4
	})

	return (
		<>
			{currentTaxon && (
				<div className="flex h-full flex-col">
					<div className="scrollbar-overlay h-3/5 overflow-auto">
						{taxonParents.map((parent, index) => (
							<TaxonRow key={parent.index} taxon={parent} index={index} condensed />
						))}
					</div>

					<div className="border-t border-zinc-700 px-3 lowercase">
						{taxonChildren.length} {currentTaxon.rank.textVi}
					</div>

					<div
						ref={subTaxonChildrenScrollerRef}
						className="scrollbar-overlay scrollbar-gutter-stable h-2/5 overflow-auto border-t border-zinc-700"
					>
						<div ref={subTaxonChildrenWrapperRef}>
							{subTaxonChildren.map((child) => (
								<TaxonRow
									key={child.data.index}
									taxon={child.data}
									index={child.index}
									condensed
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	)
})
