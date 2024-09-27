import clsx from 'clsx'
import { ReactNode, SyntheticEvent, useCallback } from 'react'
import { Taxon } from '../helpers/parse'

type Props = {
	taxon: Taxon
}

const genderCaptions: string[] = ['Đực', 'Cái', 'Đực/Cái']

export function TaxonPopupGenderPhotos({ taxon }: Props): ReactNode {
	const handlePhotoLoad = useCallback((event: SyntheticEvent<HTMLImageElement>): void => {
		const photoEl: HTMLImageElement = event.currentTarget
		const parentEl = photoEl.parentElement as HTMLDivElement

		const gapWidth: number = parentEl.clientWidth - photoEl.width
		const gapHeight: number = parentEl.clientHeight - photoEl.height

		if (gapWidth === 0 && gapHeight === 0) return
		if (gapWidth > 8 || gapHeight > 8) return

		photoEl.classList.add('size-full', 'object-cover')
	}, [])

	return (
		taxon.genderPhotos !== undefined && (
			<div className="flex flex-col gap-1">
				<div className="flex justify-center gap-1">
					{taxon.genderPhotos.map(
						(photos, index) =>
							photos.length >= 1 && (
								<figure className="flex flex-col items-center justify-stretch">
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
									<figcaption className="flex items-center gap-1">
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
									</figcaption>
								</figure>
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
		)
	)
}
