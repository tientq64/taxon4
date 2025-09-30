import clsx from 'clsx'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { En, LanguageCode, Vi } from '../constants/languages'
import { Rank } from '../constants/ranks'
import { useApp } from '../store/app'
import { Link } from './Link'
import { Tooltip } from './Tooltip'

interface RanksPanelRankRowProps {
	rank: Rank
}

export function RanksPanelRankRow({ rank }: RanksPanelRankRowProps): ReactNode {
	const { taxaCountByRankNames, striped, languageCode } = useApp()
	const { t } = useTranslation()

	const primaryLanguageRankName: string = t(`ranks.${rank.name}`, { lng: 'en' })

	const secondaryLanguageCode: LanguageCode = languageCode === En ? Vi : languageCode
	const secondaryLanguageRankName: string = t(`ranks.${rank.name}`, {
		lng: secondaryLanguageCode,
		fallbackLng: 'vi'
	})

	const beforeTooltipContent: ReactNode = (
		<>
			<div className="pt-1 pb-2">
				<div className="text-slate-300">{primaryLanguageRankName}</div>
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
			placement="right"
			beforeContent={beforeTooltipContent}
			wikipediaFetchQuery={t(`links.${rank.name}`, {
				lng: languageCode,
				fallbackLng: 'en',
				defaultValue: ''
			})}
		>
			<li className={clsx('flex cursor-pointer px-3', striped && 'odd:bg-zinc-800/20')}>
				<Link
					className={`w-1/2 pr-3 text-right ${rank.colorClass}`}
					href={t(`links.${rank.name}`, { lng: 'en', defaultValue: '' })}
					noTextColor
				>
					{primaryLanguageRankName}
				</Link>

				<Link
					className="w-1/2 text-zinc-400"
					href={t(`links.${rank.name}`, {
						lng: secondaryLanguageCode,
						fallbackLng: 'vi',
						defaultValue: ''
					})}
					noTextColor
				>
					{secondaryLanguageRankName}
				</Link>
			</li>
		</Tooltip>
	)
}
