import { ReactNode, SyntheticEvent, useCallback } from 'react'
import { Photo, Taxon } from '../helpers/parse'
import clsx from 'clsx'

const genderCaptions: string[] = ['Đực', 'Cái', 'Đực/Cái']

type Props = {
	photo: Photo
	taxon: Taxon
	column: number
	secondary?: boolean
}

export function TaxonPopupPhoto({ photo, taxon, column, secondary = false }: Props): ReactNode {
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
		<figure
			className={clsx(
				'flex-1 flex flex-col items-center justify-stretch',
				secondary && 'gap-0.5'
			)}
		>
			<div
				className={clsx(
					'flex-1 flex justify-center items-center relative overflow-hidden',
					secondary ? 'rounded' : 'w-80 rounded-md'
				)}
			>
				<img
					className="absolute size-full object-cover filter blur-3xl contrast-200 saturate-200"
					style={{
						objectViewBox: photo.viewBox
					}}
					src={photo.url}
				/>
				<img
					className={clsx(
						'rendering-contrast z-0',
						secondary ? 'max-w-36 max-h-28' : 'max-w-80 max-h-64'
					)}
					style={{
						objectViewBox: photo.viewBox
					}}
					src={photo.url}
					onLoad={secondary ? undefined : handlePhotoLoad}
				/>
			</div>
			{!secondary && (
				<figcaption className="flex items-center gap-1">
					{Number(taxon.genderPhotos?.length) >= 2 && (
						<div className="text-slate-800">{genderCaptions[column]}</div>
					)}
					{photo.caption !== undefined && (
						<div className="text-stone-600">({photo.caption})</div>
					)}
				</figcaption>
			)}
			{secondary && (
				<div className="leading-none text-xs text-stone-600">({photo.caption})</div>
			)}
		</figure>
	)
}
