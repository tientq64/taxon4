import clsx from 'clsx'
import { ReactNode } from 'react'
import { Ranks } from '../../web-extension/models/Ranks'
import { useStore } from '../store/useStore'
import { Tooltip } from './Tooltip'

export function RanksPanel(): ReactNode {
	const taxaCountByRankNames = useStore((state) => state.taxaCountByRankNames)
	const striped = useStore((state) => state.striped)

	return (
		<ul className="h-full overflow-auto scrollbar-overlay">
			{Ranks.map((rank) => (
				<Tooltip
					key={rank.name}
					placement="right"
					content={() => (
						<div className="grid grid-cols-[repeat(2,auto)] gap-x-1 px-1 py-2 leading-tight whitespace-nowrap">
							<div>Số thứ tự:</div>
							<div>{rank.level}</div>

							<div>Số lượng:</div>
							<div>{taxaCountByRankNames[rank.name]}</div>
						</div>
					)}
				>
					<li
						className={clsx(
							'flex px-3 cursor-default',
							striped && 'odd:bg-zinc-800/20'
						)}
					>
						<div className={`w-1/2 ${rank.colorClass}`}>{rank.textEn}</div>
						<div className="w-1/2 text-zinc-400">{rank.textVi}</div>
					</li>
				</Tooltip>
			))}
		</ul>
	)
}
