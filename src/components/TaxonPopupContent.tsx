import { useSize } from 'ahooks'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Taxon } from '../helpers/parse'
import { TaxonIcon } from './TaxonIcon'
import { TaxonPopupConservationStatus } from './TaxonPopupConservationStatus'
import { TaxonPopupDetails } from './TaxonPopupDetails'
import { TaxonPopupGenderPhotos } from './TaxonPopupGenderPhotos'
import { TaxonPopupHeader } from './TaxonPopupHeader'
import { TaxonPopupSummary } from './TaxonPopupSummary'

const popupWidths: number[] = [336, 336, 660, 984]

type Props = {
	taxon: Taxon
}

export function TaxonPopupContent({ taxon }: Props): ReactNode {
	const [additionalWidth, setAdditionalWidth] = useState<number>(0)
	const contentRef = useRef<HTMLDivElement>(null)
	const contentSize = useSize(contentRef)

	const photosColumn = useMemo<number>(() => {
		if (taxon.genderPhotos === undefined) return 0
		return taxon.genderPhotos.filter((photos) => photos.length > 0).length
	}, [taxon.genderPhotos])

	const handleSummaryFetchStart = useCallback((): void => {
		setAdditionalWidth(0)
	}, [])

	/**
	 * Nếu chiều cao popup lớn hơn chiều cao màn hình, hãy tăng chiều rộng để giảm chiều cao.
	 */
	useEffect(() => {
		if (contentSize === undefined) return
		if (contentSize.height <= innerHeight - 4) return
		setAdditionalWidth(328)
	}, [contentSize?.height])

	return (
		<div
			ref={contentRef}
			className="relative px-2 py-1 rounded-xl text-center bg-zinc-100 text-slate-950 shadow-lg shadow-zinc-950/75"
			style={{
				width: popupWidths[photosColumn] + additionalWidth
			}}
		>
			<TaxonIcon className="absolute left-2 top-2" taxon={taxon} />
			<TaxonPopupHeader taxon={taxon} />

			<div className="mb-1 mr-2 float-start">
				<TaxonPopupGenderPhotos taxon={taxon} />
				<TaxonPopupDetails taxon={taxon} />
				<TaxonPopupConservationStatus taxon={taxon} />
			</div>

			<TaxonPopupSummary taxon={taxon} onFetchStart={handleSummaryFetchStart} />
		</div>
	)
}
