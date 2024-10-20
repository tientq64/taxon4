import clsx from 'clsx'
import { ReactNode } from 'react'
import { ConservationStatus } from '../models/conservationStatuses'

type Props = {
	conservationStatus: ConservationStatus
	actived?: boolean
}

export function ConservationStatusBadge({ conservationStatus, actived }: Props): ReactNode {
	return (
		<div
			className={clsx(
				'flex justify-center items-center size-8 rounded-full border',
				actived ? conservationStatus.colorClass : 'border-zinc-400/60 text-zinc-700'
			)}
		>
			{conservationStatus.name}
		</div>
	)
}
