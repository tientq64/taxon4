import { ReactNode, useMemo } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/app'

interface Props {
	/** Đơn vị phân loại của hàng này. */
	taxon: Taxon
}

/** Các đường kẻ thụt lề cho hàng trong trình xem danh sách các đơn vị phân loại. */
export function TaxonRowIndents({ taxon }: Props): ReactNode {
	const { rankLevelWidth } = useApp()

	const taxonParents = useMemo<Taxon[]>(() => {
		return getTaxonParents(taxon)
	}, [taxon])

	return taxonParents.map((parent) => (
		<div
			key={parent.index}
			className="absolute h-full border-l border-zinc-600"
			style={{
				left: parent.rank.level * rankLevelWidth
			}}
		/>
	))
}
