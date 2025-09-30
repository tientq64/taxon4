import { ReactNode } from 'react'
import { conservationStatuses } from '../constants/conservationStatuses'
import { ConservationStatusPanelRow } from './ConservationStatusPanelRow'
import { Tooltip } from './Tooltip'

/** Mục các tình trạng bảo tồn. */
export function ConservationStatusPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col divide-y divide-zinc-700">
			<ul className="scrollbar-overlay flex-1 overflow-auto">
				{conservationStatuses.map((conservationStatus) => (
					<ConservationStatusPanelRow
						key={conservationStatus.name}
						conservationStatus={conservationStatus}
					/>
				))}
			</ul>

			<div className="px-3 leading-tight">
				Tình trạng bảo tồn được đánh giá theo{' '}
				<Tooltip wikipediaFetchQuery="IUCN" placement="top">
					<div className="inline-block cursor-pointer">IUCN 3.1</div>
				</Tooltip>
			</div>
		</div>
	)
}
