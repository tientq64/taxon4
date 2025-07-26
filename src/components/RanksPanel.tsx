import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Ranks } from '../constants/ranks'
import { useApp } from '../store/useAppStore'
import { Link } from './Link'
import { Tooltip } from './Tooltip'

/** Mục các bậc phân loại. */
export function RanksPanel(): ReactNode {
	const { taxaCountByRankNames, striped } = useApp()
	const { t } = useTranslation()

	return (
		<ul className="scrollbar-overlay h-full overflow-auto">
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
							'flex cursor-default px-3',
							striped && 'odd:bg-zinc-800/20'
						)}
					>
						<Link
							className={`w-1/2 pr-3 text-right ${rank.colorClass}`}
							href={t(`links.${rank.name}`, '')}
							noTextColor
						>
							{rank.textEn}
						</Link>
						<div className="w-1/2 text-zinc-400">{rank.textVi}</div>
					</li>
				</Tooltip>
			))}
		</ul>
	)
}
