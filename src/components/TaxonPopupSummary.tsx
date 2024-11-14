import { ReactNode, useEffect } from 'react'
import { Taxon } from '../helpers/parse'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'
import { useStore } from '../store/useStore'

type Props = {
	taxon: Taxon
	onFetchStart?: () => void
}

export function TaxonPopupSummary({ taxon, onFetchStart }: Props): ReactNode {
	const popupLanguageCode = useStore((state) => state.popupLanguageCode)
	const { loading, data, run, cancel } = useGetWikipediaSummary(taxon, popupLanguageCode)

	useEffect(() => {
		onFetchStart?.()
		run()
		return cancel
	}, [taxon, popupLanguageCode, onFetchStart, cancel, run])

	return (
		<div>
			{loading && (
				<div className="pt-1 clear-start">
					<div className="h-3.5 rounded bg-zinc-300 mb-2" />
					<div className="h-3.5 rounded bg-zinc-300 mb-2" />
					<div className="h-3.5 rounded rounded-bl-md bg-zinc-300 mb-1 w-3/4" />
				</div>
			)}

			{!loading && (
				<>
					{data == null && (
						<div className="py-1 clear-start leading-snug text-center text-zinc-700">
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
							<div className="pt-1 border-t border-zinc-300 clear-start text-xs text-right text-zinc-700">
								Nguồn: Wikipedia
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
