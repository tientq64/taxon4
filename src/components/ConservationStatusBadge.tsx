import clsx from 'clsx'
import { ReactNode } from 'react'
import { ConservationStatus } from '../constants/conservationStatuses'

interface Props {
	conservationStatus: ConservationStatus
	className?: string
	actived?: boolean
}

export function ConservationStatusBadge({
	conservationStatus,
	className,
	actived
}: Props): ReactNode {
	return (
		<div
			className={clsx(
				'flex size-8 items-center justify-center rounded-full border',
				!actived && 'border-zinc-500 text-zinc-400',
				actived && conservationStatus.colorClass,
				className
			)}
		>
			{conservationStatus.name}
		</div>
	)
}
