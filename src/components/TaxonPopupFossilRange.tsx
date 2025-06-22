import clsx from 'clsx'
import { ReactNode } from 'react'
import { FossilRange } from '../api/getFossilRange'
import { periods, totalPeriodsDuration } from '../constants/periods'
import { percent } from '../helpers/percent'

interface TaxonPopupFossilRangeProps {
	loading: boolean
	fossilRange: FossilRange | null | undefined
	error?: Error
}

export function TaxonPopupFossilRange({
	loading,
	fossilRange,
	error
}: TaxonPopupFossilRangeProps): ReactNode {
	return (
		<div className="flex h-16 items-center justify-center pt-2 pb-1">
			{loading && (
				<div className="flex w-80 flex-col items-center">
					<div className="mt-2 mb-1 h-6 w-full bg-zinc-500" />
					<div className="mt-1 mb-2 h-3.5 w-2/5 rounded bg-zinc-500" />
				</div>
			)}

			{!loading && (
				<>
					{error !== undefined ? (
						<div className="text-rose-300">{String(error)}</div>
					) : fossilRange == null ? (
						<div className="text-zinc-400">Không rõ thời điểm hóa thạch</div>
					) : (
						<div className="w-80">
							<div className="relative flex py-1">
								{periods.map((period) => (
									<div
										key={period.name}
										className={clsx(
											'flex h-6 items-center justify-center text-zinc-800',
											period.colorClass
										)}
										style={{
											width: percent(
												period.duration,
												totalPeriodsDuration,
												true
											)
										}}
									>
										{period.abbr}
									</div>
								))}

								<div
									className="absolute top-0 h-2 border border-lime-950 bg-lime-600"
									style={{
										right: percent(
											fossilRange.endMa,
											totalPeriodsDuration,
											true
										),
										width: percent(
											fossilRange.duration,
											totalPeriodsDuration,
											true
										)
									}}
								/>
							</div>

							<div className="text-zinc-400">
								{fossilRange.isEstimate && '~'}
								{fossilRange.startMa === fossilRange.endMa ? (
									<>{fossilRange.startMa}</>
								) : (
									<>
										{fossilRange.startMa}&ndash;{fossilRange.endMa}
									</>
								)}
								&nbsp;Ma
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
