import { useVirtualList } from 'ahooks'
import { memo, ReactNode, useMemo, useRef } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/useAppStore'
import { lowerFirst } from '../utils/lowerFirst'
import { TaxonRow } from './TaxonRow'

/** Mục phân loại. */
function ClassificationPanelMemo(): ReactNode {
	const { currentTaxon, lineHeight } = useApp()

	const siblingSubTaxaScrollerRef = useRef<HTMLDivElement>(null)
	const siblingSubTaxaWrapperRef = useRef<HTMLDivElement>(null)

	const taxonTree = useMemo<Taxon[]>(() => {
		if (currentTaxon === undefined) return []
		return getTaxonParents(currentTaxon as Taxon)
			.toReversed()
			.concat(currentTaxon as Taxon)
	}, [currentTaxon])

	const siblingTaxa: Taxon[] = (currentTaxon?.parent?.children ?? []) as Taxon[]

	const [siblingSubTaxa] = useVirtualList(siblingTaxa, {
		containerTarget: siblingSubTaxaScrollerRef,
		wrapperTarget: siblingSubTaxaWrapperRef,
		itemHeight: lineHeight,
		overscan: 4
	})

	return (
		<>
			{currentTaxon && (
				<div className="flex h-full flex-col">
					<div className="scrollbar-overlay h-3/5 overflow-auto">
						{taxonTree.map((taxon, index) => (
							<TaxonRow key={taxon.index} taxon={taxon} index={index} condensed />
						))}
					</div>

					<div className="border-t border-zinc-700 px-3">
						Các {lowerFirst(currentTaxon.rank.textVi)} ngang hàng: {siblingTaxa.length}
					</div>

					<div
						ref={siblingSubTaxaScrollerRef}
						className="scrollbar-overlay scrollbar-gutter-stable h-2/5 overflow-auto border-t border-zinc-700"
					>
						<div ref={siblingSubTaxaWrapperRef}>
							{siblingSubTaxa.map((subTaxa) => (
								<TaxonRow
									key={subTaxa.data.index}
									taxon={subTaxa.data}
									index={subTaxa.index}
									condensed
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export const ClassificationPanel = memo(ClassificationPanelMemo)
