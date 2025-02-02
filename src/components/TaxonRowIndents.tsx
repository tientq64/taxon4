import { ReactNode, useMemo } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useAppStore } from '../store/useAppStore'

interface Props {
	/**
	 * Đơn vị phân loại của hàng này.
	 */
	taxon: Taxon
}

/**
 * Các đường kẻ thụt lề cho hàng trong trình xem danh sách các đơn vị phân loại.
 */
export function TaxonRowIndents({ taxon }: Props): ReactNode {
	const rankLevelWidth = useAppStore((state) => state.rankLevelWidth)

	const taxonParents = useMemo<Taxon[]>(() => {
		return getTaxonParents(taxon)
	}, [taxon])

	return taxonParents.map((parent) => (
		<div
			key={parent.index}
			className="absolute h-full border-l border-zinc-700"
			style={{
				left: parent.rank.level * rankLevelWidth
			}}
		/>
	))
}
