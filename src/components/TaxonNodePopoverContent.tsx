import { useSize } from 'ahooks'
import clsx from 'clsx'
import { compact } from 'lodash-es'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { Taxon } from '../helpers/parse'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'
import { useStore } from '../store/useStore'

type Props = {
	taxon: Taxon
}

const popoverWidths: number[] = [336, 336, 660, 984]
const genderCaptions: string[] = ['Đực', 'Cái', 'Đực/Cái']

export function TaxonNodePopoverContent({ taxon }: Props): ReactNode {
	const popupLanguageCode = useStore((state) => state.popupLanguageCode)

	const [summaryFontSize, setSummaryFontSize] = useState<number>(16)
	const getter = useGetWikipediaSummary()
	const contentRef = useRef<HTMLDivElement>(null)
	const contentSize = useSize(contentRef)

	const taxonFullName = useMemo<string>(() => {
		return getTaxonFullName(taxon)
	}, [])

	const genderPhotosNumber = useMemo<number>(() => {
		return compact(taxon.genderPhotos).length
	}, [])

	useEffect(() => {
		if (contentSize === undefined) return
		if (contentSize.height <= innerHeight - 4) return
		setSummaryFontSize(summaryFontSize - 1)
	}, [contentSize?.height])

	useEffect(() => {
		getter.run(taxon, popupLanguageCode)
		return getter.abort
	}, [popupLanguageCode])

	return (
		<div
			ref={contentRef}
			className="px-2 py-1 rounded-xl text-center bg-zinc-100 text-slate-950 shadow-lg shadow-zinc-950/75 pointer-events-none"
			style={{
				width: popoverWidths[genderPhotosNumber]
			}}
		>
			<div className="flex items-center justify-center gap-1 font-bold text-center">
				{taxonFullName}
				{taxon.extinct && <div className="text-rose-700">{'\u2020'}</div>}
			</div>

			{taxon.textEn && <div className="-mt-1 text-slate-700">{taxon.textEn}</div>}
			{taxon.textVi && <div className="-mt-1 text-zinc-600">{taxon.textVi}</div>}

			{taxon.genderPhotos && (
				<div className="flex flex-col gap-1">
					<div className="flex justify-center gap-1">
						{taxon.genderPhotos.map(
							(photos, index) =>
								photos && (
									<div className="flex flex-col items-center justify-stretch">
										<div className="flex-1 flex justify-center items-center relative w-80 rounded-md overflow-hidden">
											<img
												className="absolute w-full h-full object-cover filter blur-3xl contrast-200 saturate-200"
												src={photos[0].url}
											/>
											<img
												className="max-w-80 max-h-60 z-0"
												src={photos[0].url}
											/>
										</div>
										<div className="flex items-center gap-1">
											<div className="text-slate-800 font-bold">
												{Number(taxon.genderPhotos?.length) >= 2
													? genderCaptions[index]
													: ''}
											</div>
											<div className="text-stone-600">
												{photos[0].caption}
											</div>
										</div>
									</div>
								)
						)}
					</div>

					<div className="flex items-center gap-1 empty:hidden">
						{taxon.genderPhotos.map(
							(photos, index) =>
								photos &&
								photos.length >= 2 && (
									<div
										className={clsx(
											'flex flex-wrap w-80',
											index === 0 ? 'justify-end' : 'justify-start'
										)}
									>
										{photos.slice(1).map((photo) => (
											<div className="flex flex-col items-center justify-stretch">
												<div className="flex justify-center items-center relative w-24 rounded overflow-hidden">
													<img
														className="absolute w-full h-full object-cover filter blur-3xl saturate-150"
														src={photo.url}
													/>
													<img
														className="max-w-24 max-h-[4.5rem] z-0"
														src={photo.url}
													/>
												</div>
												<div className="text-xs text-stone-600">
													{photo.caption}
												</div>
											</div>
										))}
									</div>
								)
						)}
					</div>
				</div>
			)}

			<div className="pt-1">
				{getter.loading && (
					<div className="pt-1">
						<div className="h-3.5 rounded bg-zinc-300 mb-2" />
						<div className="h-3.5 rounded bg-zinc-300 mb-2" />
						<div className="h-3.5 rounded bg-zinc-300 mb-1 w-3/4" />
					</div>
				)}
				{!getter.loading && (
					<>
						{getter.data && (
							<div
								className="text-justify"
								style={{
									fontSize: summaryFontSize,
									lineHeight: summaryFontSize * (1.375 / 16)
								}}
								dangerouslySetInnerHTML={{
									__html: getter.data
								}}
							/>
						)}
						{!getter.data && (
							<div className="leading-snug text-center text-zinc-700">
								Không có dữ liệu
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}
