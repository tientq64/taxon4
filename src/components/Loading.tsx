import clsx from 'clsx'
import { ReactNode } from 'react'
import { Icon } from './Icon'

interface LoadingProps {
	className?: string
	children?: ReactNode
}

export function Loading({ className, children }: LoadingProps): ReactNode {
	return (
		<div className={clsx('flex items-center justify-center gap-2 text-zinc-400', className)}>
			<Icon className="animate-spin" name="progress_activity" />
			{children}
		</div>
	)
}
