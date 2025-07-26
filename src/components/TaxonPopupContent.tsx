import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Taxon } from '../helpers/parse'
import { TaxonIcon } from './TaxonIcon'
import { TaxonPopupDetails } from './TaxonPopupDetails'
import { TaxonPopupGenderPhotos } from './TaxonPopupGenderPhotos'
import { TaxonPopupHeader } from './TaxonPopupHeader'
import { TaxonPopupStatus } from './TaxonPopupStatus'
import { TaxonPopupSummary } from './TaxonPopupSummary'

/** Khoảng cách padding theo chiều ngang trong popup. */
const paddingX: number = 12

/** Chiều rộng của khung hình ảnh chính trong popup. */
const frameWidth: number = 320

/** Khoảng cách giữa các khung hình ảnh chính trong popup. */
const gap: number = 4

/** Mảng chiều rộng popup dựa trên số lượng hình ảnh chính trong popup. */
const popupOffsetWidthsByPhotosColumn: number[] = [
	paddingX + frameWidth + paddingX,
	paddingX + frameWidth + paddingX,
	paddingX + frameWidth + gap + frameWidth + paddingX,
	paddingX + frameWidth + gap + frameWidth + gap + frameWidth + paddingX
]

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
		contentRef.current.style.width =
			popupOffsetWidthsByPhotosColumn[photosColumn] + additionalWidth + 'px'
	}

	const handleSummaryFetchStart = useCallback((): void => {
		setAdditionalWidth(0)
	}, [])

	/**
	 * Gọi khi nội dung popup thay đổi làm thay đổi chiều cao popup. Nếu chiều cao popup
	 * lớn hơn chiều cao màn hình, hãy tăng chiều rộng để giảm chiều cao.
	 */
	const handleContentSizeChange = useCallback((): void => {
		if (contentRef.current === null) return
		let height: number = contentRef.current.offsetHeight
		if (height <= innerHeight - 4) return
		setAdditionalWidth(frameWidth)
	}, [])

	useEffect(() => {
		setContentWidth(additionalWidth)
	}, [additionalWidth])

	return (
		<div
			ref={contentRef}
			className="relative rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 py-1 text-center text-zinc-100 shadow-lg shadow-zinc-950/80"
			style={{
				paddingLeft: paddingX,
				paddingRight: paddingX
			}}
		>
			<TaxonIcon className="absolute top-2 left-2" taxon={taxon} />
			<TaxonPopupHeader taxon={taxon} />

			<div className="float-start mr-3 mb-1">
				<TaxonPopupGenderPhotos taxon={taxon} />
				<TaxonPopupDetails taxon={taxon} />
				<TaxonPopupStatus taxon={taxon} additionalWidth={additionalWidth} />
			</div>

			<TaxonPopupSummary
				taxon={taxon}
				onFetchStart={handleSummaryFetchStart}
				onSummaryChange={handleContentSizeChange}
			/>
		</div>
	)
}
