import clsx from 'clsx'
import { memo, ReactNode } from 'react'
import { Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'
import { TaxonNode } from './TaxonNode'
import { TaxonRowIndents } from './TaxonRowIndents'

type Props = {
	taxon: Taxon
	index?: number
	advanced?: boolean
}

export const TaxonRow = memo(function ({
	taxon,
	index = taxon.index,
	advanced = false
}: Props): ReactNode {
	const rankLevelWidth = useStore((state) => state.rankLevelWidth)
	const striped = useStore((state) => state.striped)

	return (
		<div
			className={clsx(
				'relative flex items-center w-full h-6',
				striped && index % 2 && 'bg-zinc-800/20'
			)}
			style={{
				paddingLeft: advanced ? taxon.rank.level * rankLevelWidth : 0
			}}
		>
			{advanced && <TaxonRowIndents taxon={taxon} />}
			<TaxonNode taxon={taxon} advanced={advanced} />
		</div>
	)
})
