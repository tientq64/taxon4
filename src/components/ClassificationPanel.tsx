import { memo, ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { ClassificationPanelTaxonNode } from './ClassificationPanelTaxonNode'

export const ClassificationPanel = memo(function (): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { currentTaxon } = store

	return (
		<>
			{currentTaxon && (
				<div className="flex flex-col h-full">
					<div>
						{getTaxonParents(currentTaxon)
							.toReversed()
							.map((parent) => (
								<ClassificationPanelTaxonNode taxon={parent} />
							))}
					</div>

					<div className="flex-1 mt-2 pt-2 border-t border-zinc-700 overflow-auto scrollbar-none">
						{currentTaxon.parent?.children?.map((child) => (
							<ClassificationPanelTaxonNode taxon={child} />
						))}
					</div>
				</div>
			)}
		</>
	)
})
