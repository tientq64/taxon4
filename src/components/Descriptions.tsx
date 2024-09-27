import clsx from 'clsx'
import { ReactNode } from 'react'

type Props = {
	className?: string
	children?: ReactNode
}

export function Descriptions({ className, children }: Props): ReactNode {
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
