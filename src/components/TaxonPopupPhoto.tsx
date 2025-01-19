import { ReactNode, SyntheticEvent, useCallback } from 'react'
import { Photo, Taxon } from '../helpers/parse'
import clsx from 'clsx'

const genderCaptions: string[] = ['Đực', 'Cái', 'Đực/Cái']

interface Props {
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
				'flex flex-1 flex-col items-center justify-stretch',
				secondary && 'gap-0.5'
			)}
		>
			<div
				className={clsx(
					'relative flex flex-1 items-center justify-center overflow-hidden',
					secondary ? 'rounded' : 'w-80 rounded-md'
				)}
			>
				<img
					className="absolute size-full object-cover blur-3xl contrast-200 saturate-200 filter"
					style={{
						objectViewBox: photo.viewBox
					}}
					src={photo.url}
				/>
				<img
					className={clsx(
						'rendering-contrast z-0',
						secondary ? 'max-h-[124px] max-w-[156px]' : 'max-h-64 max-w-80'
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
				<div className="text-xs leading-none text-stone-600">({photo.caption})</div>
			)}
		</figure>
	)
}
