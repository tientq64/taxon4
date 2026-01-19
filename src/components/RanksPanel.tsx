import { ReactNode, useMemo, useState } from 'react'
import { Rank, Ranks } from '../constants/ranks'
import { RanksPanelRankRow } from './RanksPanelRankRow'
import { Switch } from './Switch'

/** Mục các bậc phân loại. */
export function RanksPanel(): ReactNode {
	const [onlyShowMainRanks, setOnlyShowMainRanks] = useState(false)

	const filteredRanks = useMemo<Rank[]>(() => {
		return Ranks.filter((rank) => {
			if (onlyShowMainRanks) return rank.isMain
			return true
		})
	}, [onlyShowMainRanks])

	return (
		<div className="flex h-full flex-col divide-y divide-zinc-700">
			<ul className="scrollbar-overlay flex-1 overflow-auto pb-1">
				{filteredRanks.map((rank) => (
					<RanksPanelRankRow key={rank.level} rank={rank} />
				))}
			</ul>

			<div className="px-3 py-1">
				<Switch
					checked={onlyShowMainRanks}
					onChange={setOnlyShowMainRanks}
					label="Chỉ hiện các bậc phân loại chính thức"
				/>
			</div>

			<div className="px-3">{filteredRanks.length} bậc phân loại</div>
		</div>
	)
}
