import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Photo, Taxon } from '../helpers/parse'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { compact } from 'lodash-es'
import { useGetWikipediaSummary } from '../hooks/useGetWikipediaSummary'

type Props = {
	taxon: Taxon
}

export function TaxonNodePopoverContent({ taxon }: Props): ReactNode {
	const getter = useGetWikipediaSummary()

	const taxonFullName = useMemo<string>(() => {
		return getTaxonFullName(taxon)
	}, [])

	const hasTwoGenderPhoto = useMemo<boolean>(() => {
		return compact(taxon.genderPhotos).length >= 2
	}, [])

	const getPhotoCaption = (photo: Photo): string | undefined => {
		return photo.caption?.replace(/^\.$/, '')
	}

	useEffect(() => {
		getter.run(taxon)
		return getter.cancel
	}, [])

	return (
		<div
			className="max-h-[calc(100vh-4px)] px-2 py-1 rounded-xl text-center bg-zinc-100 text-black shadow-lg shadow-zinc-950/75 pointer-events-none"
			style={{
				width: compact(taxon.genderPhotos).length >= 2 ? 660 : 336
			}}
		>
			<div className="flex items-center justify-center gap-1 font-bold text-center">
				{taxonFullName}
				{taxon.extinct && <div className="text-rose-500">{'\u2020'}</div>}
			</div>
			<div className="text-zinc-700">{taxon.textEn}</div>

			{taxon.genderPhotos && (
				<div className="flex flex-col gap-1">
					<div className="flex justify-center gap-1">
						{taxon.genderPhotos.map(
							(photos, index) =>
								photos && (
									<div className="flex flex-col items-center justify-stretch">
										<div className="flex-1 flex justify-center items-center relative w-80 rounded-md overflow-hidden">
											<img
												className="absolute w-full h-full object-cover filter blur-3xl contrast-200 saturate-200"
												src={photos[0].url}
											/>
											<img
												className="max-w-80 max-h-60 z-0"
												src={photos[0].url}
											/>
										</div>
										<div className="flex items-center gap-1 text-zinc-700">
											<div>
												{taxon.genderPhotos?.length === 2
													? ['Đực', 'Cái'][index]
													: ''}
											</div>
											<div>{getPhotoCaption(photos[0])}</div>
										</div>
									</div>
								)
						)}
					</div>

					<div className="flex items-center gap-1 empty:hidden">
						{taxon.genderPhotos.map(
							(photos, index) =>
								photos &&
								photos.length >= 2 && (
									<div
										className={`
											flex flex-wrap w-80
											${index === 0 ? 'justify-end' : 'justify-start'}
										`}
									>
										{photos.slice(1).map((photo) => (
											<div className="flex flex-col items-center justify-stretch">
												<div className="flex justify-center items-center relative w-24 rounded overflow-hidden">
													<img
														className="absolute w-full h-full object-cover filter blur-3xl saturate-150"
														src={photo.url}
													/>
													<img
														className="max-w-24 max-h-[4.5rem] z-0"
														src={photo.url}
													/>
												</div>
												<div className="text-xs text-zinc-700">
													{photo.caption}
												</div>
											</div>
										))}
									</div>
								)
						)}
					</div>
				</div>
			)}

			{getter.loading && <div className="leading-snug text-center">Đang tải...</div>}
			{!getter.loading && (
				<>
					{getter.data && (
						<div
							className="leading-snug text-justify"
							dangerouslySetInnerHTML={{
								__html: getter.data
							}}
						/>
					)}
					{!getter.data && (
						<div className="leading-snug text-center">Không có dữ liệu</div>
					)}
				</>
			)}
		</div>
	)
}
