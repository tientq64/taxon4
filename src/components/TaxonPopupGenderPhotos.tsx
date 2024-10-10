import { ReactNode } from 'react'
import { Taxon } from '../helpers/parse'
import { TaxonPopupPhoto } from './TaxonPopupPhoto'

type Props = {
	taxon: Taxon
}

export function TaxonPopupGenderPhotos({ taxon }: Props): ReactNode {
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
								<div className="flex flex-wrap gap-1 w-80 mb-1">
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
