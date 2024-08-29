import { ReactNode, useContext } from 'react'
import { Ranks } from '../../web-extension/models/Ranks'
import { AppContext } from '../App'
import { Tooltip } from './Tooltip'

export function RanksPanel(): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { taxaCountByRankNames } = store

	return (
		<div className="h-full overflow-auto scrollbar-none">
			{Ranks.map((rank) => (
				<Tooltip
					key={rank.name}
					placement="right"
					content={() => (
						<div className="grid grid-cols-2 py-1 leading-tight gap-1 [&>:nth-child(odd)]:text-zinc-700">
							<div>Số thứ tự:</div>
							<div>{rank.level}</div>

							<div>Số lượng:</div>
							<div>{taxaCountByRankNames[rank.name]}</div>
						</div>
					)}
				>
					<div className="flex flex-wrap leading-tight odd:bg-zinc-800/20 cursor-default">
						<div className="w-1/3 pt-1">{rank.level}</div>
						<div className={`w-2/3 pt-1 ${rank.colorClass}`}>{rank.textEn}</div>
						<div className="w-1/3 pb-1 text-zinc-400">
							{taxaCountByRankNames[rank.name]}
						</div>
						<div className="w-2/3 pb-1 text-zinc-400">{rank.textVi}</div>
					</div>
				</Tooltip>
			))}
		</div>
	)
}
