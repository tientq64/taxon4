import clsx from 'clsx'
import { AnchorHTMLAttributes, ReactNode } from 'react'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	noTextColor?: boolean
	noHoverUnderline?: boolean
}

export function Link({
	className,
	href,
	target = '_blank',
	noTextColor,
	noHoverUnderline,
	children,
	...props
}: LinkProps): ReactNode {
	return (
		<a
			{...props}
			className={clsx(
				!noTextColor && 'text-sky-300',
				!noHoverUnderline && href && 'cursor-pointer underline-offset-2 hover:underline',
				className
			)}
			href={href || undefined}
			target={target}
		>
			{children}
		</a>
	)
}
