import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { getTaxonIcon } from '../helpers/getTaxonIcon'
import { Taxon } from '../helpers/parse'
import { getTaxonIconUrl } from '../helpers/getTaxonIconUrl'

type Props = {
	className?: string
	taxon: Taxon
}

export function TaxonIcon({ className, taxon }: Props): ReactNode {
	const icon = useMemo<string | undefined>(() => {
		return getTaxonIcon(taxon)
	}, [taxon])

	return (
		icon && (
			<img
				className={clsx('size-7 p-0.5 rounded-lg bg-zinc-900', className)}
				src={getTaxonIconUrl(icon)}
				alt="Icon"
			/>
		)
	)
}
