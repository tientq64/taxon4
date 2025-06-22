import clsx from 'clsx'
import { ReactNode } from 'react'
import { ConservationStatus } from '../constants/conservationStatuses'

interface Props {
	conservationStatus: ConservationStatus
	actived?: boolean
}

export function ConservationStatusBadge({ conservationStatus, actived }: Props): ReactNode {
	return (
		<div
			className={clsx(
				'flex size-8 items-center justify-center rounded-full',
				!actived && 'border border-zinc-500 text-zinc-400',
				actived && conservationStatus.colorClass
			)}
		>
			{conservationStatus.name}
		</div>
	)
}
