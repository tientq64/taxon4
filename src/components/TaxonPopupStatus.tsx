import { useRequest } from 'ahooks'
import clsx from 'clsx'
import { ReactNode, useEffect } from 'react'
import { getConservationStatus } from '../api/getConservationStatus'
import { FossilRange, getFossilRange, RecentExtinction } from '../api/getFossilRange'
import { conservationStatusesMap } from '../constants/conservationStatuses'
import { RanksMap } from '../constants/ranks'
import { isFossilRange } from '../helpers/isFossilRange'
import { isRecentExtinction } from '../helpers/isRecentExtinction'
import { Taxon } from '../helpers/parse'
import { TaxonPopupConservationStatus } from './TaxonPopupConservationStatus'
import { TaxonPopupFossilRange } from './TaxonPopupFossilRange'

interface TaxonPopupStatusProps {
	taxon: Taxon
	additionalWidth: number
}

export function TaxonPopupStatus({ taxon, additionalWidth }: TaxonPopupStatusProps): ReactNode {
	const getConservationStatusApi = useRequest(getConservationStatus, { manual: true })
	const getFossilRangeApi = useRequest(getFossilRange, { manual: true })

	const isSkip: boolean = taxon.rank.level < RanksMap.species.level

	const isShowFossilRange: boolean =
		(getFossilRangeApi.loading && !isRecentExtinction(getFossilRangeApi.data)) ||
		isFossilRange(getFossilRangeApi.data) ||
		getFossilRangeApi.error !== undefined

	useEffect(() => {
		if (isSkip) return
		if (taxon.extinct) {
			getConservationStatusApi.mutate(conservationStatusesMap.EX)
			getFossilRangeApi.run(taxon)
		} else {
			getConservationStatusApi.run(taxon)
			getFossilRangeApi.mutate(null)
		}
		return () => {
			getConservationStatusApi.cancel()
			getFossilRangeApi.cancel()
		}
	}, [taxon])

	if (isSkip) return null

	return (
		<div className={clsx('mx-auto', additionalWidth === 0 && 'border-b border-zinc-500')}>
			{isShowFossilRange && (
				<TaxonPopupFossilRange
					loading={getFossilRangeApi.loading}
					fossilRange={getFossilRangeApi.data as FossilRange | null | undefined}
					error={getFossilRangeApi.error}
				/>
			)}
			{/* getFossilRangeApi.loading && !isFossilRange(getFossilRangeApi.data) */}
			{!isShowFossilRange && (
				<TaxonPopupConservationStatus
					loading={getConservationStatusApi.loading}
					conservationStatus={getConservationStatusApi.data}
					recentExtinction={getFossilRangeApi.data as RecentExtinction | null | undefined}
				/>
			)}
		</div>
	)
}
