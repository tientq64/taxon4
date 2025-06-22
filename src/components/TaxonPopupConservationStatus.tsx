import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { RecentExtinction } from '../api/getFossilRange'
import { ConservationStatus, conservationStatuses } from '../constants/conservationStatuses'
import { ConservationStatusBadge } from './ConservationStatusBadge'

interface Props {
	loading: boolean
	conservationStatus: ConservationStatus | null | undefined
	recentExtinction: RecentExtinction | null | undefined
}

export function TaxonPopupConservationStatus({
	loading,
	conservationStatus,
	recentExtinction
}: Props): ReactNode {
	const { t } = useTranslation()

	return (
		<div className="flex h-16 items-center justify-center pt-2 pb-1">
			{loading && (
				<div className="flex w-80 flex-col items-center">
					<div className="mt-1 h-8 w-full rounded-full bg-zinc-500" />
					<div className="mt-1.5 mb-2 h-3.5 w-1/2 rounded bg-zinc-500" />
				</div>
			)}

			{!loading && (
				<>
					{conservationStatus == null && (
						<div className="text-zinc-400">Không rõ tình trạng bảo tồn</div>
					)}

					{conservationStatus != null && (
						<div className="w-80">
							<div className="flex justify-between">
								{conservationStatuses.map((status) => (
									<ConservationStatusBadge
										key={status.name}
										conservationStatus={status}
										actived={status.name === conservationStatus.name}
									/>
								))}
							</div>

							<div className="text-zinc-400">
								{t(`conservationStatuses.${conservationStatus.name}`)}

								{recentExtinction != null && (
									<> ({recentExtinction.extinctionTime})</>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
