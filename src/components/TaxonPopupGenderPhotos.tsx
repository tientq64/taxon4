import clsx from 'clsx'
import { ReactNode, SyntheticEvent, useCallback } from 'react'
import { Taxon } from '../helpers/parse'
import { TaxonPopupPhoto } from './TaxonPopupPhoto'

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
						(photos, column) =>
							photos.length >= 1 && (
								<TaxonPopupPhoto
									key={column}
									photo={photos[0]}
									taxon={taxon}
									column={column}
								/>
							)
					)}
				</div>

				<div className="flex items-center gap-1 empty:hidden">
					{taxon.genderPhotos.map(
						(photos, column) =>
							photos.length >= 2 && (
								<div
									className={clsx(
										'flex flex-wrap gap-1 w-80 mb-1',
										column === 0 ? 'justify-end' : 'justify-start'
									)}
								>
									{photos.slice(1).map((photo) => (
										<TaxonPopupPhoto
											key={column}
											photo={photo}
											taxon={taxon}
											column={column}
											secondary
										/>
									))}
								</div>
							)
					)}
				</div>
			</div>
		)
	)
}
