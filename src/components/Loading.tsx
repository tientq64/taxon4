import clsx from 'clsx'
import { ReactNode } from 'react'
import { Icon } from './Icon'

interface Props {
	className?: string
	children?: ReactNode
}

export function Loading({ className, children }: Props): ReactNode {
	return (
		<div className={clsx('flex justify-center items-center gap-2 text-zinc-400', className)}>
			<Icon className="animate-spin" name="progress_activity" />
			{children}
		</div>
	)
}
