import { useSize } from 'ahooks'
import clsx from 'clsx'
import { ReactNode, SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { getTaxonIcon } from '../helpers/getTaxonIcon'
import { Taxon } from '../helpers/parse'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'
import { useStore } from '../store/useStore'
import { lowerFirst } from '../utils/lowerFirst'
import { TaxonIcon } from './TaxonIcon'
import { useGetConservationStatus } from '../hooks/useGetConservationStatus'
import { RanksMap } from '../../web-extension/models/Ranks'
import { conservationStatuses, conservationStatusesMap } from '../models/conservationStatuses'

type Props = {
	taxon: Taxon
}

const popoverWidths: number[] = [336, 336, 660, 984]
const genderCaptions: string[] = ['Đực', 'Cái', 'Đực/Cái']

export function TaxonNodePopoverContent({ taxon }: Props): ReactNode {
	const popupLanguageCode = useStore((state) => state.popupLanguageCode)

	const [summaryFontSize, setSummaryFontSize] = useState<number>(16)
	const fetchSummary = useGetWikipediaSummary()
	const fetchConservationStatus = useGetConservationStatus()
	const contentRef = useRef<HTMLDivElement>(null)
	const contentSize = useSize(contentRef)

	const taxonFullName = useMemo<string>(() => {
		return getTaxonFullName(taxon)
	}, [taxon])

	const taxonIcon = useMemo<string | undefined>(() => {
		return getTaxonIcon(taxon)
	}, [taxon])

	const photoColumn = useMemo<number>(() => {
		if (taxon.genderPhotos === undefined) return 0
		return taxon.genderPhotos.filter((photos) => photos.length > 0).length
	}, [taxon.genderPhotos])

	const hasSomeCaption = useMemo<boolean>(() => {
		if (taxon.genderPhotos === undefined) return false
		if (taxon.genderPhotos.length >= 2) return true
		return taxon.genderPhotos.flat().some((photo) => photo.caption !== undefined)
	}, [taxon.genderPhotos])

	const handlePhotoLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
		const photoEl: HTMLImageElement = event.currentTarget
		const parentEl = photoEl.parentElement as HTMLDivElement

		const gapWidth: number = parentEl.clientWidth - photoEl.width
		const gapHeight: number = parentEl.clientHeight - photoEl.height

		if (gapWidth === 0 && gapHeight === 0) return
		if (gapWidth > 10 || gapHeight > 10) return

		photoEl.classList.add('size-full', 'object-cover')
	}

	useEffect(() => {
		if (contentSize === undefined) return
		if (contentSize.height <= innerHeight - 4) return
		setSummaryFontSize(summaryFontSize - 0.1)
	}, [contentSize?.height])

	useEffect(() => {
		if (taxon.rank.level < RanksMap.species.level) return
		if (taxon.extinct) {
			fetchConservationStatus.mutate(conservationStatusesMap.EX)
			return
		}
		fetchConservationStatus.run(taxon)
		return fetchConservationStatus.abort
	}, [taxon])

	useEffect(() => {
		setSummaryFontSize(16)
		fetchSummary.run(taxon, popupLanguageCode)
		return fetchSummary.abort
	}, [popupLanguageCode, taxon])

	return (
		<div
			ref={contentRef}
			className="relative px-2 py-1 rounded-xl text-center bg-zinc-100 text-slate-950 shadow-lg shadow-zinc-950/75"
			style={{
				width: popoverWidths[photoColumn]
			}}
		>
			{taxonIcon && <TaxonIcon className="absolute left-2 top-2" icon={taxonIcon} />}

			<div className="flex items-center justify-center gap-1 px-9 py-2 font-bold leading-tight text-center">
				{taxonFullName}
				{taxon.extinct && <div className="text-rose-700">{'\u2020'}</div>}
			</div>

			{taxon.textEn && <div className="-mt-1 text-slate-700">{taxon.textEn}</div>}
			{taxon.textVi && <div className="-mt-1 text-zinc-600">{taxon.textVi}</div>}

			{taxon.genderPhotos !== undefined && (
				<div className="flex flex-col gap-1">
					<div className="flex justify-center gap-1">
						{taxon.genderPhotos.map(
							(photos, index) =>
								photos.length >= 1 && (
									<div className="flex flex-col items-center justify-stretch">
										<div className="flex-1 flex justify-center items-center relative w-80 rounded-md overflow-hidden">
											<img
												className="absolute w-full h-full object-cover filter blur-3xl contrast-200 saturate-200"
												style={{
													objectViewBox: photos[0].viewBox
												}}
												src={photos[0].url}
											/>
											<img
												className="max-w-80 max-h-64 rendering-contrast z-0"
												style={{
													objectViewBox: photos[0].viewBox
												}}
												src={photos[0].url}
												onLoad={handlePhotoLoad}
											/>
										</div>
										<div className="flex items-center gap-1">
											{Number(taxon.genderPhotos?.length) >= 2 && (
												<div className="text-slate-800">
													{genderCaptions[index]}
												</div>
											)}
											{photos[0].caption !== undefined && (
												<div className="text-stone-600">
													({photos[0].caption})
												</div>
											)}
										</div>
									</div>
								)
						)}
					</div>

					<div className="flex items-center gap-1 empty:hidden">
						{taxon.genderPhotos.map(
							(photos, index) =>
								photos.length >= 2 && (
									<div
										className={clsx(
											'flex flex-wrap gap-1 w-80 mb-1',
											index === 0 ? 'justify-end' : 'justify-start'
										)}
									>
										{photos.slice(1).map((photo) => (
											<div className="flex-1 flex flex-col items-center justify-center gap-0.5">
												<div className="flex justify-center items-center relative rounded overflow-hidden">
													<img
														className="absolute w-full h-full object-cover filter blur-3xl saturate-150"
														style={{
															objectViewBox: photo.viewBox
														}}
														src={photo.url}
													/>
													<img
														className="max-w-24 max-h-[4.5rem] rendering-contrast z-0"
														style={{
															objectViewBox: photo.viewBox
														}}
														src={photo.url}
													/>
												</div>
												<div className="leading-none text-xs text-stone-600">
													({photo.caption})
												</div>
											</div>
										))}
									</div>
								)
						)}
					</div>
				</div>
			)}

			{(taxon.genderPhotos === undefined || hasSomeCaption) && (
				<div className="border-b border-zinc-300/80"></div>
			)}

			<div className="pt-1 flex flex-wrap border-b border-zinc-300/80 text-left">
				<div className="w-1/2 flex gap-3">
					Bậc:
					<div className="text-zinc-600">{taxon.rank.textVi}</div>
				</div>

				{taxon.children?.[0] && (
					<div className="w-1/2 flex gap-3">
						Gồm:
						<div className="text-zinc-600">
							{taxon.children.length} {lowerFirst(taxon.children[0].rank.textVi)}
						</div>
					</div>
				)}
			</div>

			{taxon.rank.level >= RanksMap.species.level && (
				<div className="flex justify-center items-center w-80 h-10 mx-auto pt-2">
					{fetchConservationStatus.loading && (
						<div className="w-full h-8 rounded-full bg-zinc-300" />
					)}

					{!fetchConservationStatus.loading && (
						<>
							{fetchConservationStatus.data === undefined && (
								<div className="text-zinc-600">Tình trạng bảo tồn không rõ</div>
							)}

							{fetchConservationStatus.data !== undefined && (
								<div className="w-full flex justify-between">
									{conservationStatuses.map((status) => (
										<div
											className={clsx(
												'flex justify-center items-center size-8 rounded-full border',
												status === fetchConservationStatus.data
													? fetchConservationStatus.data.colorClass
													: 'border-zinc-400/60'
											)}
										>
											{status.name}
										</div>
									))}
								</div>
							)}
						</>
					)}
				</div>
			)}

			<div className="pt-1">
				{fetchSummary.loading && (
					<div className="pt-1">
						<div className="h-3.5 rounded bg-zinc-300 mb-2" />
						<div className="h-3.5 rounded bg-zinc-300 mb-2" />
						<div className="h-3.5 rounded rounded-bl-lg bg-zinc-300 mb-1 w-3/4" />
					</div>
				)}

				{!fetchSummary.loading && (
					<>
						{fetchSummary.data && (
							<div
								className="text-justify"
								style={{
									fontSize: summaryFontSize,
									lineHeight: summaryFontSize * (1.375 / 16)
								}}
								dangerouslySetInnerHTML={{
									__html: fetchSummary.data
								}}
							/>
						)}
						{!fetchSummary.data && (
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
