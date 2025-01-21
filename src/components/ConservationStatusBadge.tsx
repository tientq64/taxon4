import clsx from 'clsx'
import { ReactNode } from 'react'
import { ConservationStatus } from '../models/conservationStatuses'

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
				!actived && 'border-zinc-400/60 text-zinc-700',
				actived && conservationStatus.colorClass,
				className
			)}
		>
			{conservationStatus.name}
		</div>
	)
}
