import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ConservationStatus, ConservationStatusName } from '../constants/conservationStatuses'
import { LanguageCode } from '../constants/languages'
import { useApp } from '../store/app'
import { ConservationStatusBadge } from './ConservationStatusBadge'
import { Tooltip } from './Tooltip'

interface ConservationStatusPanelRowProps {
	conservationStatus: ConservationStatus
}

export function ConservationStatusPanelRow({
	conservationStatus
}: ConservationStatusPanelRowProps): ReactNode {
	const { striped } = useApp()
	const { t } = useTranslation()

	const englishName: string = t(`conservationStatuses.${conservationStatus.name}`, {
		lng: LanguageCode.En
	})
	const translatedName: string = t(`conservationStatuses.${conservationStatus.name}`)

	const beforeTooltipContent: ReactNode = (
		<div className="pt-1 pb-2">
			<div className="text-slate-300">{englishName}</div>
			<div className="text-zinc-400">{translatedName}</div>
		</div>
	)

	return (
		<Tooltip
			placement="right"
			beforeContent={beforeTooltipContent}
			wikipediaFetchQuery={translatedName}
		>
			<li
				key={conservationStatus.name}
				className={clsx(
					'flex cursor-default items-center gap-3 px-3 py-1 leading-tight',
					striped && 'odd:bg-zinc-800/20'
				)}
			>
				<ConservationStatusBadge
					className={clsx(
						conservationStatus.name === ConservationStatusName.EX &&
							'ring ring-zinc-800'
					)}
					conservationStatus={conservationStatus}
					actived
				/>
				<div>
					<div>{englishName}</div>
					<div className="text-[15px] text-zinc-500">{translatedName}</div>
				</div>
			</li>
		</Tooltip>
	)
}
