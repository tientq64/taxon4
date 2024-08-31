import clsx from 'clsx'
import { ReactNode, useContext } from 'react'
import { AppContext } from '../App'
import { Taxon } from '../helpers/parse'

type Props = {
	taxon: Taxon
}

export function ClassificationPanelTaxonNode({ taxon }: Props): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { scrollTo } = store

	return (
		<div
			key={taxon.index}
			className="flex items-center gap-2"
			onClick={() => scrollTo(taxon.index)}
		>
			<div className={clsx('flex-1 truncate', taxon.rank.colorClass)}>{taxon.name}</div>
			{taxon.textEn && <div className="flex-1 truncate text-slate-400">{taxon.textEn}</div>}
		</div>
	)
}
