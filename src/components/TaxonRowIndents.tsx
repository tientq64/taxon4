import { ReactNode, useMemo } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'

type Props = {
	taxon: Taxon
}

export function TaxonRowIndents({ taxon }: Props): ReactNode {
	const rankLevelWidth = useStore((state) => state.rankLevelWidth)

	const taxonParents = useMemo<Taxon[]>(() => {
		return getTaxonParents(taxon)
	}, [taxon])

	return taxonParents.map((parent) => (
		<div
			className="absolute h-full border-l border-zinc-700"
			style={{
				left: parent.rank.level * rankLevelWidth
			}}
		/>
	))
}
