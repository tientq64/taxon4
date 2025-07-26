import clsx from 'clsx'
import { ReactNode } from 'react'

interface DescriptionsProps {
	className?: string
	children?: ReactNode
}

export function Descriptions({ className, children }: DescriptionsProps): ReactNode {
	return (
		<dl
			className={clsx(
				'[&>:nth-child(odd)]:text-zinc-400 [&>:nth-child(odd):not(:first-child)]:mt-2',
				className
			)}
		>
			{children}
		</dl>
	)
}
