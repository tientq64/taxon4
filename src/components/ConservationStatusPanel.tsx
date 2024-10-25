import clsx from 'clsx'
import { ReactNode } from 'react'
import { conservationStatuses } from '../models/conservationStatuses'
import { useStore } from '../store/useStore'
import { ConservationStatusBadge } from './ConservationStatusBadge'

/**
 * Mục các tình trạng bảo tồn.
 */
export function ConservationStatusPanel(): ReactNode {
	const striped = useStore((state) => state.striped)

	return (
		<ul className="h-full overflow-auto scrollbar-overlay">
			{conservationStatuses.map((conservationStatus) => (
				<li
					key={conservationStatus.name}
					className={clsx(
						'flex items-center gap-3 px-3 py-1 leading-tight cursor-default',
						striped && 'odd:bg-zinc-800/20'
					)}
				>
					<ConservationStatusBadge conservationStatus={conservationStatus} actived />
					<div>
						<div>{conservationStatus.textEn}</div>
						<div className="text-sm text-zinc-500">{conservationStatus.textVi}</div>
					</div>
				</li>
			))}
		</ul>
	)
}
