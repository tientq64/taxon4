import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { conservationStatuses } from '../constants/conservationStatuses'
import { LanguageCode } from '../constants/languages'
import { useApp } from '../store/useAppStore'
import { ConservationStatusBadge } from './ConservationStatusBadge'

/** Mục các tình trạng bảo tồn. */
export function ConservationStatusPanel(): ReactNode {
	const { striped } = useApp()

	const { t } = useTranslation()

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
						<div>
							{t(`conservationStatuses.${conservationStatus.name}`, {
								lng: LanguageCode.En
							})}
						</div>
						<div className="text-sm text-zinc-500">
							{t(`conservationStatuses.${conservationStatus.name}`)}
						</div>
					</div>
				</li>
			))}
		</ul>
	)
}
