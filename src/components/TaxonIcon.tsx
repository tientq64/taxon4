import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { getTaxonIcon } from '../helpers/getTaxonIcon'
import { getTaxonIconUrl } from '../helpers/getTaxonIconUrl'
import { Taxon } from '../helpers/parse'

interface TaxonIconProps {
	className?: string
	taxon: Taxon
}

export function TaxonIcon({ className, taxon }: TaxonIconProps): ReactNode {
	const icon = useMemo(() => getTaxonIcon(taxon), [taxon])

	return (
		icon && (
			<img
				className={clsx('size-7 p-0.5', className)}
				src={getTaxonIconUrl(icon)}
				alt="Icon"
			/>
		)
	)
}
