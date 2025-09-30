import clsx from 'clsx'
import { ReactNode } from 'react'
import { ConservationStatus } from '../constants/conservationStatuses'

interface Props {
	className?: string
	conservationStatus: ConservationStatus
	actived?: boolean
}

export function ConservationStatusBadge({
	className,
	conservationStatus,
	actived
}: Props): ReactNode {
	return (
		<div
			className={clsx(
				'flex size-8 items-center justify-center rounded-full',
				!actived && 'border border-zinc-500 text-zinc-400',
				actived && conservationStatus.colorClass,
				className
			)}
		>
			{conservationStatus.name}
		</div>
	)
}
