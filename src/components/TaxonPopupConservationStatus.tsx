import clsx from 'clsx'
import { ReactNode, useEffect } from 'react'
import { RanksMap } from '../../web-extension/models/Ranks'
import { Taxon } from '../helpers/parse'
import { useGetConservationStatus } from '../hooks/useGetConservationStatus'
import { conservationStatuses, conservationStatusesMap } from '../models/conservationStatuses'

type Props = {
	taxon: Taxon
}

export function TaxonPopupConservationStatus({ taxon }: Props): ReactNode {
	const { loading, data, run, mutate, cancel } = useGetConservationStatus()

	useEffect(() => {
		if (taxon.rank.level < RanksMap.species.level) return
		if (taxon.extinct) {
			mutate(conservationStatusesMap.EX)
			return
		}
		run(taxon)
		return cancel
	}, [taxon])

	return (
		taxon.rank.level >= RanksMap.species.level && (
			<div className="flex justify-center items-center w-80 h-10 mx-auto pt-2">
				{loading && <div className="w-full h-8 rounded-full bg-zinc-300" />}

				{!loading && (
					<>
						{data == null && (
							<div className="text-zinc-600">Tình trạng bảo tồn không rõ</div>
						)}

						{data != null && (
							<div className="w-full flex justify-between">
								{conservationStatuses.map((status) => (
									<div
										className={clsx(
											'flex justify-center items-center size-8 rounded-full border',
											status === data
												? data.colorClass
												: 'border-zinc-400/60 text-zinc-700'
										)}
									>
										{status.name}
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		)
	)
}
