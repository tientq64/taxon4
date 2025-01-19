import { ReactNode, useMemo } from 'react'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { Taxon } from '../helpers/parse'

interface Props {
	taxon: Taxon
}

export function TaxonPopupHeader({ taxon }: Props): ReactNode {
	const taxonFullName = useMemo<string>(() => {
		return getTaxonFullName(taxon)
	}, [taxon])

	return (
		<header>
			<div className="flex items-center justify-center gap-1 px-9 py-2 text-center font-bold leading-tight">
				{taxonFullName}
				{taxon.extinct && <div className="text-rose-700">{'\u2020'}</div>}
			</div>
			{taxon.textEn && <div className="-mt-1 text-slate-700">{taxon.textEn}</div>}
			{taxon.textVi && <div className="-mt-1 text-zinc-600">{taxon.textVi}</div>}
		</header>
	)
}
