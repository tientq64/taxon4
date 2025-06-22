import { ReactNode, useMemo } from 'react'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { Taxon } from '../helpers/parse'

interface TaxonPopupHeaderProps {
	taxon: Taxon
}

export function TaxonPopupHeader({ taxon }: TaxonPopupHeaderProps): ReactNode {
	const taxonFullName = useMemo<string>(() => {
		return getTaxonFullName(taxon, false, true)
	}, [taxon])

	return (
		<header>
			<div className="flex items-center justify-center gap-1 px-9 py-2.5 text-center leading-none font-bold">
				{taxon.candidatus && <div>Ca.</div>}
				<div className="max-w-full">{taxonFullName}</div>
				{taxon.extinct && <div className="text-rose-400">{'\u2020'}</div>}
			</div>

			<div className="-mt-1 py-0.5 leading-none empty:hidden">
				{taxon.textEn && <div className="text-slate-300 [&+div]:mt-1">{taxon.textEn}</div>}
				{taxon.textVi && <div className="text-zinc-400">{taxon.textVi}</div>}
			</div>
		</header>
	)
}
