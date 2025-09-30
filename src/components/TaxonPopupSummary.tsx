import { useRequest } from 'ahooks'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getWikipediaSummary } from '../api/getWikipediaSummary'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/app'
import { Icon } from './Icon'

interface Props {
	taxon: Taxon
	onFetchStart?: () => void
	onSummaryChange?: () => void
}

export function TaxonPopupSummary({ taxon, onFetchStart, onSummaryChange }: Props): ReactNode {
	const { languageCode } = useApp()
	const { t } = useTranslation()
	const { loading, data, run, cancel } = useRequest(getWikipediaSummary, { manual: true })

	useEffect(() => {
		onFetchStart?.()
		run(taxon, languageCode)
		return cancel
	}, [taxon, languageCode])

	useEffect(() => {
		onSummaryChange?.()
	}, [data])

	return (
		<div className="leading-[1.325]">
			{loading && (
				<div className="clear-start pt-1">
					<div className="mt-px mb-2 h-3.25 rounded bg-zinc-500" />
					<div className="mb-2 h-3.25 rounded bg-zinc-500" />
					<div className="mb-2 h-3.25 w-4/7 rounded rounded-bl-md bg-zinc-500" />
				</div>
			)}

			{!loading && (
				<>
					{data == null && (
						<div className="clear-start flex flex-col gap-0.75 py-2 text-center text-zinc-400">
							<Icon name="inbox" />
							{t('taxonPopup.noDataFound')}
						</div>
					)}
					{data != null && (
						<div
							className="text-justify"
							dangerouslySetInnerHTML={{
								__html: data
							}}
						/>
					)}
				</>
			)}

			<div className="clear-start mt-1 flex justify-end border-t border-zinc-500 pt-1 text-xs text-zinc-300">
				{loading && <div className="my-0.75 h-2.5 w-2/7 rounded bg-zinc-500" />}
				{!loading && (
					<>
						{data == null && <>&nbsp;</>}
						{data != null && <>{t('taxonPopup.source')}: Wikipedia</>}
					</>
				)}
			</div>
		</div>
	)
}
