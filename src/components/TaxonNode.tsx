import { ReactNode, SyntheticEvent, useContext, useMemo } from 'react'
import { Photo, Taxon } from '../helpers/parse'
import { AppContext } from '../App'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { Popper } from './Popper'
import { TaxonNodePopoverContent } from './TaxonNodePopoverContent'

type Props = {
	taxon: Taxon
}

export function TaxonNode({ taxon }: Props): ReactNode {
	const store = useContext(AppContext)
	if (store === null) return

	const { rankLevelWidth } = store

	const photos: Photo[] = useMemo(() => {
		return taxon.genderPhotos?.flat().filter((photo) => photo !== undefined) ?? []
	}, [])

	const handlePhotoLoadEnd = (event: SyntheticEvent<HTMLImageElement>): void => {
		event.currentTarget.classList.remove('w-5', 'h-4')
	}

	return (
		<div
			className={`relative flex items-center w-full h-6 ${
				taxon.index % 2 ? 'bg-zinc-800/20' : ''
			}`}
			style={{
				paddingLeft: `${taxon.rank.level * rankLevelWidth}px`
			}}
		>
			{getTaxonParents(taxon).map((parent) => (
				<div
					className="absolute h-full border-l border-zinc-700"
					style={{
						left: `${parent.rank.level * rankLevelWidth}px`
					}}
				/>
			))}

			<Popper
				allowedPlacements={['left', 'right']}
				distance={8}
				padding={2}
				hoverDelay={10}
				arrowClassName="fill-zinc-100"
				content={() => <TaxonNodePopoverContent taxon={taxon} />}
			>
				<div className="flex items-center cursor-pointer">
					<div
						className={`
						flex items-center
						${taxon.textEn || taxon.textVi || photos.length > 0 ? 'min-w-32 mr-2' : ''}
					`}
					>
						<div className={taxon.rank.colorClass}>{taxon.name}</div>
						{taxon.extinct && <div className="ml-1 text-rose-400">{'\u2020'}</div>}
					</div>

					{taxon.textEn && <div className="text-slate-400">{taxon.textEn}</div>}

					{taxon.textVi && (
						<>
							{taxon.textEn && <div className="mx-2 text-stone-400">&middot;</div>}
							<div className="text-stone-400">{taxon.textVi}</div>
						</>
					)}
				</div>
			</Popper>

			{photos.length > 0 && (
				<div className="flex items-center">
					{(taxon.textEn || taxon.textVi) && (
						<div className="mx-2 text-stone-400">&middot;</div>
					)}
					<div className="flex items-center gap-2">
						{photos.map((photo) => (
							<img
								className="max-w-5 max-h-4 w-5 h-4 rounded outline outline-1 -outline-offset-1 outline-white/25"
								src={photo.url}
								loading="lazy"
								onLoad={handlePhotoLoadEnd}
								onError={handlePhotoLoadEnd}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
