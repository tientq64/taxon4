import { ReactNode, useEffect } from 'react'
import { Taxon } from '../helpers/parse'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'
import { useAppStore } from '../store/useAppStore'

interface Props {
	taxon: Taxon
	onFetchStart?: () => void
}

export function TaxonPopupSummary({ taxon, onFetchStart }: Props): ReactNode {
	const popupLanguageCode = useAppStore((state) => state.popupLanguageCode)
	const { loading, data, run, cancel } = useGetWikipediaSummary()

	useEffect(() => {
		onFetchStart?.()
		run(taxon, popupLanguageCode)
		return cancel
	}, [taxon, popupLanguageCode, onFetchStart, cancel, run])

	return (
		<div>
			{loading && (
				<div className="clear-start pt-1">
					<div className="mb-2 h-3.5 rounded bg-zinc-300" />
					<div className="mb-2 h-3.5 rounded bg-zinc-300" />
					<div className="mb-1 h-3.5 w-3/4 rounded rounded-bl-md bg-zinc-300" />
				</div>
			)}

			{!loading && (
				<>
					{data == null && (
						<div className="clear-start py-1 text-center leading-snug text-zinc-700">
							Không tìm thấy dữ liệu
						</div>
					)}
					{data != null && (
						<div>
							<div
								className="text-justify leading-snug"
								dangerouslySetInnerHTML={{
									__html: data
								}}
							/>
							<div className="clear-start border-t border-zinc-300 pt-1 text-right text-xs text-zinc-700">
								Nguồn: Wikipedia
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
