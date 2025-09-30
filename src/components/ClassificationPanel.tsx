import { useVirtualList } from 'ahooks'
import { memo, ReactNode, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/app'
import { lowerFirst } from '../utils/lowerFirst'
import { TaxonRow } from './TaxonRow'

/** Mục phân loại. */
function ClassificationPanelMemo(): ReactNode {
	const { activeTaxon, lineHeight } = useApp()

	const siblingVirtualTaxaScrollerRef = useRef<HTMLDivElement>(null)
	const siblingVirtualTaxaWrapperRef = useRef<HTMLDivElement>(null)
	const { t } = useTranslation()

	const taxonTree = useMemo<Taxon[]>(() => {
		if (activeTaxon === undefined) return []
		return getTaxonParents(activeTaxon as Taxon)
			.toReversed()
			.concat(activeTaxon as Taxon)
	}, [activeTaxon])

	const siblingTaxa: Taxon[] = (activeTaxon?.parent?.children ?? []) as Taxon[]

	const [siblingVirtualTaxa] = useVirtualList(siblingTaxa, {
		containerTarget: siblingVirtualTaxaScrollerRef,
		wrapperTarget: siblingVirtualTaxaWrapperRef,
		itemHeight: lineHeight,
		overscan: 4
	})

	if (activeTaxon === undefined) return null

	return (
		<div className="flex h-full flex-col">
			<div className="scrollbar-overlay h-3/5 overflow-auto">
				{taxonTree.map((taxon, index) => (
					<TaxonRow key={taxon.index} taxon={taxon} index={index} condensed />
				))}
			</div>

			<div className="border-t border-zinc-700 px-3">
				Các {lowerFirst(t(`ranks.${activeTaxon.rank.name}`))} cùng cấp: {siblingTaxa.length}
			</div>

			<div
				ref={siblingVirtualTaxaScrollerRef}
				key={siblingTaxa.at(0)?.index}
				className="scrollbar-overlay scrollbar-gutter-stable h-2/5 overflow-auto border-t border-zinc-700"
			>
				<div ref={siblingVirtualTaxaWrapperRef}>
					{siblingVirtualTaxa.map((virtualTaxa) => (
						<TaxonRow
							key={virtualTaxa.data.index}
							taxon={virtualTaxa.data}
							index={virtualTaxa.index}
							condensed
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export const ClassificationPanel = memo(ClassificationPanelMemo)
