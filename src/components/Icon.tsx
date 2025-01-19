import clsx from 'clsx'
import { ReactNode } from 'react'

interface IconProps {
	className?: string
	name: string
}

export function Icon({ className, name }: IconProps): ReactNode {
	return <span className={clsx('material-symbols-rounded', className)}>{name}</span>
}
