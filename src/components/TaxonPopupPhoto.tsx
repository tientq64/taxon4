import clsx from 'clsx'
import { ReactNode, SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Photo, Taxon } from '../helpers/parse'
import { upperFirst } from '../utils/upperFirst'

interface TaxonPopupPhotoProps {
	photo: Photo
	taxon: Taxon
	column: number
	secondary?: boolean
}

export function TaxonPopupPhoto({
	photo,
	taxon,
	column,
	secondary = false
}: TaxonPopupPhotoProps): ReactNode {
	const [shouldFillPhoto, setShouldFillPhoto] = useState<boolean>(false)
	const { t } = useTranslation()

	const genderCaptions: string[] = [
		t('taxonPopup.male'),
		t('taxonPopup.female'),
		t('taxonPopup.maleFemale')
	]

	const handlePrimaryPhotoLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
		const photoEl: HTMLImageElement = event.currentTarget
		const parentEl = photoEl.parentElement
		if (parentEl === null) return

		const gapWidth: number = parentEl.clientWidth - photoEl.width
		const gapHeight: number = parentEl.clientHeight - photoEl.height

		if (gapWidth === 0 && gapHeight === 0) return
		if (gapWidth > 8 || gapHeight > 8) return

		setShouldFillPhoto(true)
	}

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
					className="absolute size-full object-cover blur-3xl saturate-200"
					style={{
						objectViewBox: photo.viewBox
					}}
					src={photo.url}
				/>
				<img
					className={clsx(
						'rendering-contrast z-0',
						secondary ? 'max-h-[124px] max-w-[156px]' : 'max-h-64 max-w-80',
						shouldFillPhoto && 'size-full object-cover'
					)}
					style={{
						objectViewBox: photo.viewBox
					}}
					src={photo.url}
					onLoad={secondary ? undefined : handlePrimaryPhotoLoad}
				/>
			</div>

			{!secondary && (
				<figcaption className="flex items-center gap-1">
					{Number(taxon.genderPhotos?.length) >= 2 && (
						<div className="text-slate-300">{genderCaptions[column]}</div>
					)}
					{photo.caption !== undefined && (
						<div className="text-zinc-400">
							{upperFirst(t(`photoLabels.${photo.caption}`, photo.caption))}
						</div>
					)}
				</figcaption>
			)}
			{secondary && photo.caption !== undefined && (
				<div className="pb-1 text-xs leading-none font-medium text-zinc-400">
					{upperFirst(t(`photoLabels.${photo.caption}`, photo.caption))}
				</div>
			)}
		</figure>
	)
}
