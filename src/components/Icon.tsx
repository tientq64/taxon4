import clsx from 'clsx'
import { ReactElement, ReactNode } from 'react'
import Twemoji from 'react-twemoji'

interface IconProps {
	className?: string
	name: string | ReactElement
}

const emojiRegex: RegExp = /^\p{Emoji}+$/u

export function Icon({ className, name }: IconProps): ReactNode {
	const isEmoji: boolean = typeof name === 'string' && emojiRegex.test(name)
	const isMaterialIcon: boolean = typeof name === 'string' && !isEmoji

	const iconClassName: string = clsx(
		isMaterialIcon && 'material-symbols-rounded',
		'inline-flex rendering-contrast',
		className
	)

	if (isEmoji) {
		return <Twemoji options={{ className: iconClassName }}>{name}</Twemoji>
	}

	return <div className={iconClassName}>{name}</div>
}
