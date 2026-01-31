import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ConservationStatus, ConservationStatusName } from '../constants/conservationStatuses'
import { En } from '../constants/languages'
import { getWikipediaUrlFromQuery } from '../helpers/getWikipediaUrlFromQuery'
import { useApp } from '../store/app'
import { ConservationStatusBadge } from './ConservationStatusBadge'
import { Link } from './Link'
import { Tooltip } from './Tooltip'

interface ConservationStatusPanelRowProps {
	conservationStatus: ConservationStatus
}

export function ConservationStatusPanelRow({
	conservationStatus
}: ConservationStatusPanelRowProps): ReactNode {
	const { striped, languageCode } = useApp()
	const { t } = useTranslation()

	const englishName: string = t(`conservationStatuses.${conservationStatus.name}.name`, {
		lng: En
	})
	const localeName: string = t(`conservationStatuses.${conservationStatus.name}.name`)

	const wikipediaUrl: string = getWikipediaUrlFromQuery(
		t(`conservationStatuses.${conservationStatus.name}.wikipediaQuery`, {
			fallbackLng: false,
			defaultValue: ''
		}),
		languageCode
	)

	const beforeTooltipContent: ReactNode = (
		<div className="pt-1 pb-2">
			<div className="text-slate-300">{englishName}</div>
			<div className="text-zinc-400">{localeName}</div>
		</div>
	)

	return (
		<Tooltip
			placement="right"
			beforeContent={beforeTooltipContent}
			wikipediaFetchQuery={wikipediaUrl}
		>
			<Link
				key={conservationStatus.name}
				className={clsx(
					'flex cursor-default items-center gap-3 px-3 py-1 leading-tight',
					striped && 'odd:bg-zinc-800/20'
				)}
				href={wikipediaUrl}
				noTextColor
				noHoverUnderline
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
					<div className="text-[15px] text-zinc-500">{localeName}</div>
				</div>
			</Link>
		</Tooltip>
	)
}
