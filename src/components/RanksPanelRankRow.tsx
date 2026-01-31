import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { En, LanguageCode, Vi } from '../constants/languages'
import { Rank } from '../constants/ranks'
import { getWikipediaUrlFromQuery } from '../helpers/getWikipediaUrlFromQuery'
import { useApp } from '../store/app'
import { Link } from './Link'
import { Tooltip } from './Tooltip'

interface RanksPanelRankRowProps {
	rank: Rank
}

export function RanksPanelRankRow({ rank }: RanksPanelRankRowProps): ReactNode {
	const { taxaCountByRankNames, striped, languageCode } = useApp()
	const { t } = useTranslation()

	const englishRankName: string = t(`ranks.${rank.name}.name`, { lng: En })

	const secondaryLanguageCode: LanguageCode = languageCode === En ? Vi : languageCode
	const secondaryLanguageRankName: string = t(`ranks.${rank.name}.name`, {
		lng: secondaryLanguageCode,
		fallbackLng: 'vi'
	})

	const wikipediaUrl: string = getWikipediaUrlFromQuery(
		t(`ranks.${rank.name}.wikipediaQuery`, {
			fallbackLng: false,
			defaultValue: ''
		}),
		languageCode
	)

	const beforeTooltipContent: ReactNode = (
		<>
			<div className="pt-1 pb-2">
				<div className="text-slate-300">{englishRankName}</div>
				<div className="text-zinc-400">{secondaryLanguageRankName}</div>
			</div>

			<div className="grid grid-cols-[repeat(2,auto)] gap-x-1 py-1 text-left whitespace-nowrap">
				<div className="flex gap-3">
					Số thứ tự:
					<span className="text-zinc-400">{rank.level}</span>
				</div>
				<div className="flex gap-3">
					Số lượng:
					<span className="text-zinc-400">{taxaCountByRankNames[rank.name]}</span>
				</div>
			</div>
		</>
	)

	return (
		<Tooltip
			contentClassName="w-80"
			placement="right"
			beforeContent={beforeTooltipContent}
			wikipediaFetchQuery={wikipediaUrl}
		>
			<Link
				className={clsx(
					'flex cursor-default px-3',
					rank.colorClass,
					striped && 'odd:bg-zinc-800/20'
				)}
				href={wikipediaUrl}
				noTextColor
				noHoverUnderline
			>
				<div className="w-1/2 pr-3 text-right">{englishRankName}</div>
				<div className="w-1/2 text-zinc-400">{secondaryLanguageRankName}</div>
			</Link>
		</Tooltip>
	)
}
