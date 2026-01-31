import { ReactNode } from 'react'
import { Taxon } from '../helpers/parse'
import { TaxonPopupPhoto } from './TaxonPopupPhoto'

interface Props {
	taxon: Taxon
}

export function TaxonPopupGenderPhotos({ taxon }: Props): ReactNode {
	return (
		<div className="mt-1 flex flex-col gap-1">
			{taxon.genderPhotos !== undefined && (
				<>
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
								photos.length >= 1 && (
									<div key={column} className="mb-1 flex w-80 flex-wrap gap-1">
										{photos.slice(1).map((photo, index) => (
											<TaxonPopupPhoto
												key={index}
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
				</>
			)}
		</div>
	)
}
