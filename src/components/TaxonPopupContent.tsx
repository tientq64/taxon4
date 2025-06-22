import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Taxon } from '../helpers/parse'
import { TaxonIcon } from './TaxonIcon'
import { TaxonPopupDetails } from './TaxonPopupDetails'
import { TaxonPopupGenderPhotos } from './TaxonPopupGenderPhotos'
import { TaxonPopupHeader } from './TaxonPopupHeader'
import { TaxonPopupStatus } from './TaxonPopupStatus'
import { TaxonPopupSummary } from './TaxonPopupSummary'

const popupWidths: number[] = [336, 336, 660, 984]

interface Props {
	taxon: Taxon
}

export function TaxonPopupContent({ taxon }: Props): ReactNode {
	const [additionalWidth, setAdditionalWidth] = useState<number>(0)
	const contentRef = useRef<HTMLDivElement>(null)

	const photosColumn = useMemo<number>(() => {
		if (taxon.genderPhotos === undefined) return 0
		return taxon.genderPhotos.filter((photos) => photos.length > 0).length
	}, [taxon.genderPhotos])

	const setContentWidth = (additionalWidth: number): void => {
		if (contentRef.current === null) return
		contentRef.current.style.width = popupWidths[photosColumn] + additionalWidth + 'px'
	}

	const handleSummaryFetchStart = useCallback((): void => {
		setAdditionalWidth(0)
	}, [])

	/**
	 * Nếu chiều cao popup lớn hơn chiều cao màn hình, hãy tăng chiều rộng để giảm chiều
	 * cao.
	 */
	const handleSummaryChange = useCallback((): void => {
		if (contentRef.current === null) return
		let height: number = contentRef.current.offsetHeight
		if (height <= innerHeight - 4) return
		setAdditionalWidth(328)
	}, [])

	useEffect(() => {
		setContentWidth(additionalWidth)
	}, [additionalWidth])

	return (
		<div
			ref={contentRef}
			className="relative rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 px-2 py-1 text-center text-zinc-100 shadow-lg shadow-zinc-950/80"
		>
			<TaxonIcon className="absolute top-2 left-2" taxon={taxon} />
			<TaxonPopupHeader taxon={taxon} />

			<div className="float-start mr-2 mb-1">
				<TaxonPopupGenderPhotos taxon={taxon} />
				<TaxonPopupDetails taxon={taxon} />
				<TaxonPopupStatus taxon={taxon} additionalWidth={additionalWidth} />
			</div>

			<TaxonPopupSummary
				taxon={taxon}
				onFetchStart={handleSummaryFetchStart}
				onSummaryChange={handleSummaryChange}
			/>
		</div>
	)
}
