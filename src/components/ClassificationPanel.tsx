import { ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { ClassificationPanelTaxonNode } from './ClassificationPanelTaxonNode'

export function ClassificationPanel(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { subTaxa, linesOverscan } = store

	return (
		<>
			{subTaxa[linesOverscan + 1] && (
				<div className="flex flex-col h-full">
					<div>
						{getTaxonParents(subTaxa[linesOverscan + 1].data)
							.toReversed()
							.map((parent) => (
								<ClassificationPanelTaxonNode taxon={parent} />
							))}
					</div>

					<div className="flex-1 mt-2 pt-2 border-t border-zinc-700 overflow-auto scrollbar-none">
						{subTaxa[linesOverscan + 1].data.parent?.children?.map((child) => (
							<ClassificationPanelTaxonNode taxon={child} />
						))}
					</div>
				</div>
			)}
		</>
	)
}
