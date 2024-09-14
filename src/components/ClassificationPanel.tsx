import { memo, ReactNode, useMemo } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'
import { TaxonNode } from './TaxonNode'

export const ClassificationPanel = memo(function (): ReactNode {
	const currentTaxon = useStore((state) => state.currentTaxon)

	const taxonParents = useMemo<Taxon[]>(() => {
		if (currentTaxon === undefined) return []
		return getTaxonParents(currentTaxon).toReversed()
	}, [currentTaxon])

	const taxonChildren = useMemo<Taxon[] | undefined>(() => {
		return currentTaxon?.parent?.children
	}, [currentTaxon])

	return (
		<>
			{currentTaxon && (
				<div className="flex flex-col h-full">
					<div>
						{taxonParents.map((parent) => (
							<TaxonNode
								key={parent.index}
								taxon={parent}
								hiddenIndent
								hiddenTextVi
								hiddenNoCommonName
								hiddenChildrenCount
								hiddenPhotos
								fillLabel
							/>
						))}
					</div>

					<div className="flex-1 mt-2 pt-2 border-t border-zinc-700 overflow-auto scrollbar-none">
						{taxonChildren?.map((child) => (
							<TaxonNode
								key={child.index}
								taxon={child}
								hiddenIndent
								hiddenTextVi
								hiddenNoCommonName
								hiddenChildrenCount
								hiddenPhotos
								fillLabel
							/>
						))}
					</div>
				</div>
			)}
		</>
	)
})
