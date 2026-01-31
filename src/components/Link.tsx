import clsx from 'clsx'
import { AnchorHTMLAttributes, forwardRef, ReactNode, Ref } from 'react'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	noTextColor?: boolean
	noHoverUnderline?: boolean
}

function LinkComponent(
	{
		className,
		href,
		target = '_blank',
		noTextColor,
		noHoverUnderline,
		children,
		...props
	}: LinkProps,
	ref: Ref<HTMLAnchorElement>
): ReactNode {
	return (
		<a
			{...props}
			ref={ref}
			className={clsx(
				!noTextColor && 'text-sky-300',
				!noHoverUnderline && 'underline-offset-2 hover:underline',
				href && 'cursor-pointer!',
				className
			)}
			href={href || undefined}
			target={target}
		>
			{children}
		</a>
	)
}

export const Link = forwardRef(LinkComponent)
