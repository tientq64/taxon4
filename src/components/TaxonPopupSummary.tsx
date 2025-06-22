import { useRequest } from 'ahooks'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getWikipediaSummary } from '../api/getWikipediaSummary'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/useAppStore'

interface Props {
	taxon: Taxon
	onFetchStart?: () => void
	onSummaryChange?: () => void
}

export function TaxonPopupSummary({ taxon, onFetchStart, onSummaryChange }: Props): ReactNode {
	const { popupLanguageCode } = useApp()
	const { t } = useTranslation()
	const { loading, data, run, cancel } = useRequest(getWikipediaSummary, { manual: true })

	useEffect(() => {
		onFetchStart?.()
		run(taxon, popupLanguageCode)
		return cancel
	}, [taxon, popupLanguageCode])

	useEffect(() => {
		onSummaryChange?.()
	}, [data])

	return (
		<div>
			{loading && (
				<div className="clear-start pt-1">
					<div className="mb-2 h-3.5 rounded bg-zinc-500" />
					<div className="mb-2 h-3.5 rounded bg-zinc-500" />
					<div className="mb-1 h-3.5 w-3/4 rounded rounded-bl-md bg-zinc-500" />
				</div>
			)}

			{!loading && (
				<>
					{data == null && (
						<div className="clear-start py-1 text-center leading-[1.325] text-zinc-400">
							{t('taxonPopup.noDataFound')}
						</div>
					)}
					{data != null && (
						<div>
							<div
								className="text-justify leading-[1.325]"
								dangerouslySetInnerHTML={{
									__html: data
								}}
							/>
							<div className="clear-start mt-1 border-t border-zinc-500 pt-1 text-right text-xs text-zinc-300">
								{t('taxonPopup.source')}: Wikipedia
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
