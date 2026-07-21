import clsx from 'clsx'
import { ReactElement, ReactNode } from 'react'
import Twemoji from 'react-twemoji'

interface IconProps {
	className?: string
	name: string | ReactElement
}

const emojiRegex = /^\p{Emoji}+$/u

export function Icon({ className, name }: IconProps): ReactNode {
	const isStringName = typeof name === 'string'
	const isEmoji = isStringName && emojiRegex.test(name)
	const isMaterialIcon = isStringName && !isEmoji

	const iconClassName = clsx(
		isMaterialIcon && 'material-symbols-rounded',
		'inline-flex rendering-contrast',
		className
	)

	if (isEmoji) {
		return <Twemoji options={{ className: iconClassName }}>{name}</Twemoji>
	}

	return <div className={iconClassName}>{name}</div>
}
