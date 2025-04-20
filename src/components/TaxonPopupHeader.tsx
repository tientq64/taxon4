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
			<div className="font-heading flex items-center justify-center gap-1 px-9 py-2.5 text-center text-[22px] font-bold leading-none">
				<div className="max-w-full">{taxonFullName}</div>
				{taxon.extinct && <div className="text-rose-500">{'\u2020'}</div>}
			</div>

			<div className="-mt-1 pb-0.5 leading-tight empty:hidden">
				{taxon.textEn && <div className="text-slate-300">{taxon.textEn}</div>}
				{taxon.textVi && <div className="text-zinc-400">{taxon.textVi}</div>}
			</div>
		</header>
	)
}
