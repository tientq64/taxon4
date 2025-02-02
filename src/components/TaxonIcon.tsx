import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { getTaxonIcon } from '../helpers/getTaxonIcon'
import { Taxon } from '../helpers/parse'
import { getTaxonIconUrl } from '../helpers/getTaxonIconUrl'

interface TaxonIconProps {
	className?: string
	taxon: Taxon
}

export function TaxonIcon({ className, taxon }: TaxonIconProps): ReactNode {
	const icon = useMemo<string | undefined>(() => {
		return getTaxonIcon(taxon)
	}, [taxon])

	return (
		icon && (
			<img
				className={clsx('size-7 rounded-md p-0.5', className)}
				src={getTaxonIconUrl(icon)}
				alt="Icon"
			/>
		)
	)
}
