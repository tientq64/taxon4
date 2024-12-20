import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'

type Props = {
	/**
	 * Đơn vị phân loại của hàng này.
	 */
	taxon: Taxon
}

/**
 * Các đường kẻ thụt lề cho hàng trong trình xem danh sách các đơn vị phân loại.
 */
export function TaxonRowIndents({ taxon }: Props): ReactNode {
	const rankLevelWidth = useStore((state) => state.rankLevelWidth)
	const indentGuideShown = useStore((state) => state.indentGuideShown)

	const taxonParents = useMemo<Taxon[]>(() => {
		return getTaxonParents(taxon)
	}, [taxon])

	return taxonParents.map((parent) => (
		<div
			key={parent.index}
			className={clsx('absolute h-full', indentGuideShown && 'border-l border-zinc-700')}
			style={{
				left: parent.rank.level * rankLevelWidth
			}}
		/>
	))
}
