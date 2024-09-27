import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { getTaxonIcon } from '../helpers/getTaxonIcon'
import { Taxon } from '../helpers/parse'

type Props = {
	className?: string
	taxon: Taxon
}

export function TaxonIcon({ className, taxon }: Props): ReactNode {
	const icon = useMemo<string | undefined>(() => {
		return getTaxonIcon(taxon)
	}, [taxon])

	const subIcon: string = useMemo<string>(() => {
		if (icon === undefined) return ''
		return icon.slice(0, -3)
	}, [icon])

	return (
		icon && (
			<img
				className={clsx('size-7 p-0.5 rounded-lg bg-zinc-900', className)}
				src={`https://cdn-icons-png.flaticon.com/32/${subIcon}/${icon}.png`}
				alt="Icon"
			/>
		)
	)
}
