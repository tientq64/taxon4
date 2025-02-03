import clsx from 'clsx'
import { ReactNode } from 'react'
import { conservationStatuses } from '../constants/conservationStatuses'
import { useAppStore } from '../store/useAppStore'
import { ConservationStatusBadge } from './ConservationStatusBadge'

/**
 * Mục các tình trạng bảo tồn.
 */
export function ConservationStatusPanel(): ReactNode {
	const striped = useAppStore((state) => state.striped)

	return (
		<ul className="scrollbar-overlay h-full overflow-auto">
			{conservationStatuses.map((conservationStatus) => (
				<li
					key={conservationStatus.name}
					className={clsx(
						'flex cursor-default items-center gap-3 px-3 py-1 leading-tight',
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
