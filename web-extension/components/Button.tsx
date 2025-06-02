import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button({
	className,
	disabled,
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>): ReactNode {
	return (
		<button
			{...props}
			className={clsx(
				className,
				'cursor-pointer rounded! border border-zinc-600 px-2 py-1 hover:bg-zinc-800',
				disabled && 'pointer-events-none! bg-zinc-600! text-zinc-400!'
			)}
			disabled={disabled}
		>
			{children}
		</button>
	)
}
