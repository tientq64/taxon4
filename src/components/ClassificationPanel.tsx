import { useVirtualList } from 'ahooks'
import { memo, ReactNode, useMemo, useRef } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'
import { TaxonNode } from './TaxonNode'

export const ClassificationPanel = memo(function (): ReactNode {
	const currentTaxon = useStore((state) => state.currentTaxon)
	const lineHeight = useStore((state) => state.lineHeight)

	const subTaxonChildrenScrollerRef = useRef<HTMLDivElement>(null)
	const subTaxonChildrenWrapperRef = useRef<HTMLDivElement>(null)

	const taxonParents = useMemo<Taxon[]>(() => {
		if (currentTaxon === undefined) return []
		return getTaxonParents(currentTaxon).toReversed()
	}, [currentTaxon?.parent])

	const taxonChildren = useMemo<Taxon[]>(() => {
		return currentTaxon?.parent?.children ?? []
	}, [currentTaxon?.parent])

	const [subTaxonChildren] = useVirtualList(taxonChildren, {
		containerTarget: subTaxonChildrenScrollerRef,
		wrapperTarget: subTaxonChildrenWrapperRef,
		itemHeight: lineHeight,
		overscan: 4
	})

	return (
		<>
			{currentTaxon && (
				<div className="flex flex-col h-full">
					<div className="h-3/5 overflow-auto scrollbar-overlay">
						{taxonParents.map((parent, index) => (
							<TaxonNode
								key={parent.index}
								taxon={parent}
								index={index}
								hiddenIndent
								hiddenTextVi
								hiddenNoCommonName
								hiddenChildrenCount
								hiddenPhotos
								labelClassName="px-3"
								fillLabel
							/>
						))}
					</div>

					<div className="px-3 border-t border-zinc-700 lowercase">
						{taxonChildren.length} {currentTaxon.rank.textVi}
					</div>

					<div
						ref={subTaxonChildrenScrollerRef}
						className="h-2/5 border-t border-zinc-700 overflow-auto scrollbar-overlay scrollbar-gutter-stable"
					>
						<div ref={subTaxonChildrenWrapperRef}>
							{subTaxonChildren.map((child) => (
								<TaxonNode
									key={child.data.index}
									taxon={child.data}
									index={child.index}
									hiddenIndent
									hiddenTextVi
									hiddenNoCommonName
									hiddenChildrenCount
									hiddenPhotos
									labelClassName="px-3"
									fillLabel
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	)
})
