import clsx from 'clsx'
import { memo, ReactNode } from 'react'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/useAppStore'
import { TaxonNode } from './TaxonNode'
import { TaxonRowIndents } from './TaxonRowIndents'

interface TaxonRowProps {
	/** Đơn vị phân loại của hàng này. */
	taxon: Taxon

	/**
	 * Số thứ tự của hàng. Thường được dùng để xác định hàng chẵn/lẻ khi hiển thị danh
	 * sách dạng kẻ sọc.
	 */
	index?: number

	/** Hiển thị trong chế độ thu gọn. */
	condensed?: boolean
}

/**
 * Một hàng đại diện cho một đơn vị phân loại trong trình xem danh sách các đơn vị phân
 * loại.
 */
function TaxonRowMemo({ taxon, index = taxon.index, condensed = false }: TaxonRowProps): ReactNode {
	const { rankLevelWidth, striped, indentGuideVisible, lineHeight } = useApp()

	return (
		<div
			className={clsx(
				'relative flex w-full items-center',
				striped && index % 2 && 'bg-zinc-800/15'
			)}
			style={{
				height: lineHeight,
				paddingLeft: condensed ? 0 : taxon.rank.level * rankLevelWidth
			}}
		>
			{!condensed && indentGuideVisible && <TaxonRowIndents taxon={taxon} />}
			{condensed && (
				<div className="mr-3 w-2/5 text-right text-zinc-400">{taxon.rank.textEn}</div>
			)}
			<TaxonNode taxon={taxon} condensed={condensed} />
		</div>
	)
}

export const TaxonRow = memo(TaxonRowMemo)
