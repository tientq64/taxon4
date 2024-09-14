import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'

type Props = {
	className?: string
	icon: string
}

export function TaxonIcon({ className, icon }: Props): ReactNode {
	const subIcon: string = useMemo<string>(() => {
		return icon.slice(0, -3)
	}, [icon])

	return (
		<img
			className={clsx('size-7 p-0.5 rounded-lg bg-zinc-900', className)}
			src={`https://cdn-icons-png.flaticon.com/32/${subIcon}/${icon}.png`}
		/>
	)
}
