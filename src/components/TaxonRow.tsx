import clsx from 'clsx'
import { memo, ReactNode } from 'react'
import { Taxon } from '../helpers/parse'
import { useAppStore } from '../store/useAppStore'
import { TaxonNode } from './TaxonNode'
import { TaxonRowIndents } from './TaxonRowIndents'

interface Props {
	/**
	 * Đơn vị phân loại của hàng này.
	 */
	taxon: Taxon
	/**
	 * Số thứ tự của hàng. Thường được dùng để xác định hàng chẵn/lẻ khi hiển thị danh
	 * sách dạng kẻ sọc.
	 */
	index?: number
	/**
	 * Hiển thị trong chế độ thu gọn.
	 */
	condensed?: boolean
}

/**
 * Một hàng đại diện cho một đơn vị phân loại trong trình xem danh sách các đơn vị phân
 * loại.
 */
export const TaxonRow = memo(function ({
	taxon,
	index = taxon.index,
	condensed = false
}: Props): ReactNode {
	const rankLevelWidth = useAppStore((state) => state.rankLevelWidth)
	const striped = useAppStore((state) => state.striped)
	const indentGuideShown = useAppStore((state) => state.indentGuideShown)

	return (
		<div
			className={clsx(
				'relative flex h-6 w-full items-center',
				striped && index % 2 && 'bg-zinc-800/20'
			)}
			style={{
				paddingLeft: condensed ? 0 : taxon.rank.level * rankLevelWidth
			}}
		>
			{indentGuideShown && !condensed && <TaxonRowIndents taxon={taxon} />}
			<TaxonNode taxon={taxon} condensed={condensed} />
		</div>
	)
})
