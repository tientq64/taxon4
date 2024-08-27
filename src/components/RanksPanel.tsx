import { ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { RanksPanelTaxonNode } from './RanksPanelTaxonNode'

export function RanksPanel(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { currentPanel, subTaxa, linesOverscan } = store

	return (
		<>
			{currentPanel.name === 'ranks' && subTaxa[linesOverscan + 1] && (
				<div className="flex flex-col h-full">
					<div>
						{getTaxonParents(subTaxa[linesOverscan + 1].data)
							.toReversed()
							.map((parent) => (
								<RanksPanelTaxonNode taxon={parent} />
							))}
					</div>

					<div className="flex-1 mt-2 pt-2 border-t border-zinc-700 overflow-auto scrollbar-none">
						{subTaxa[linesOverscan + 1].data.parent?.children?.map((child) => (
							<RanksPanelTaxonNode taxon={child} />
						))}
					</div>
				</div>
			)}
		</>
	)
}
