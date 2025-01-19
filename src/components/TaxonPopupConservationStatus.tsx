import clsx from 'clsx'
import { ReactNode, useEffect } from 'react'
import { RanksMap } from '../../web-extension/models/Ranks'
import { Taxon } from '../helpers/parse'
import { useGetConservationStatus } from '../hooks/useGetConservationStatus'
import { conservationStatuses, conservationStatusesMap } from '../models/conservationStatuses'
import { ConservationStatusBadge } from './ConservationStatusBadge'

interface Props {
	taxon: Taxon
	additionalWidth: number
}

export function TaxonPopupConservationStatus({ taxon, additionalWidth }: Props): ReactNode {
	const { loading, data, run, mutate, cancel } = useGetConservationStatus(taxon)

	useEffect(() => {
		if (taxon.rank.level < RanksMap.species.level) return
		if (taxon.extinct) {
			mutate(conservationStatusesMap.EX)
			return
		}
		run()
		return cancel
	}, [cancel, mutate, run, taxon])

	return (
		taxon.rank.level >= RanksMap.species.level && (
			<div
				className={clsx(
					'mx-auto flex h-16 items-center justify-center border-zinc-300 pb-1 pt-2',
					additionalWidth === 0 && 'border-b'
				)}
			>
				{loading && (
					<div className="flex w-80 flex-col items-center">
						<div className="mt-1 h-8 w-full rounded-full bg-zinc-300" />
						<div className="mb-2 mt-1.5 h-3.5 w-1/2 rounded bg-zinc-300" />
					</div>
				)}

				{!loading && (
					<>
						{data == null && (
							<div className="text-zinc-600">Tình trạng bảo tồn không rõ</div>
						)}

						{data != null && (
							<div className="w-80">
								<div className="flex justify-between">
									{conservationStatuses.map((conservationStatus) => (
										<ConservationStatusBadge
											key={conservationStatus.name}
											conservationStatus={conservationStatus}
											actived={conservationStatus === data}
										/>
									))}
								</div>
								<div className="text-zinc-600">{data.textVi}</div>
							</div>
						)}
					</>
				)}
			</div>
		)
	)
}
