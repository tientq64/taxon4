import clsx from 'clsx'
import { ReactElement, ReactNode } from 'react'

interface IconProps {
	className?: string
	name: string | ReactElement
}

export function Icon({ className, name }: IconProps): ReactNode {
	const isMaterialIcon: boolean = typeof name === 'string'

	return (
		<div className={clsx(isMaterialIcon && 'material-symbols-rounded inline-flex', className)}>
			{name}
		</div>
	)
}
