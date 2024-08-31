import clsx from 'clsx'
import { ReactNode } from 'react'

type Props = {
	className?: string
	name: string
}

export function Icon({ className, name }: Props): ReactNode {
	return <span className={clsx('material-symbols-rounded', className)}>{name}</span>
}
