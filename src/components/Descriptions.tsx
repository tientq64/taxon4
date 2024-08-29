import { ReactNode } from 'react'

type Props = {
	children?: ReactNode
}

export function Descriptions({ children }: Props): ReactNode {
	return (
		<div className="[&>:nth-child(odd)]:text-zinc-400 [&>:nth-child(odd):not(:first-child)]:mt-2">
			{children}
		</div>
	)
}
