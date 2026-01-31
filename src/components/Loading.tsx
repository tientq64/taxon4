import clsx from 'clsx'
import { ReactNode } from 'react'

interface LoadingProps {
	className?: string
	children?: ReactNode
}

export function Loading({ className, children }: LoadingProps): ReactNode {
	return (
		<div className={clsx('flex items-center justify-center gap-2 text-zinc-400', className)}>
			<div className="size-4.5 animate-spin rounded-full border-3 border-dotted" />
			{children}
		</div>
	)
}
