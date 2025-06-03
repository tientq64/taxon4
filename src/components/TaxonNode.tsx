import clsx from 'clsx'
import { MouseEvent, ReactNode, useContext, useMemo, useState } from 'react'
import { lastRank } from '../../web-extension/constants/Ranks'
import { textToBase64 } from '../../web-extension/helpers/textToBase64'
import { checkIsDevEnv } from '../helpers/checkIsDevEnv'
import { checkIsIncertaeSedis } from '../helpers/checkIsIncertaeSedis'
import { handleTaxonNodeMouseUp } from '../helpers/handleTaxonNodeMouseUp'
import { Photo, Taxon } from '../helpers/parse'
import { ScrollToContext } from '../pages/MainPage'
import { useAppStore } from '../store/useAppStore'
import { Popper } from './Popper'
import { TaxonNodeTextEnHints } from './TaxonNodeTextEnHints'
import { TaxonPopupContent } from './TaxonPopupContent'

export interface TaxonNodeProps {
	/**
	 * Đơn vị phân loại của hàng này.
	 */
	taxon: Taxon
	className?: string
	condensed?: boolean
}

/**
 * Một nút chứa nội dung của một hàng trong trình xem danh sách các đơn vị phân loại.
 */
export function TaxonNode({ taxon, className, condensed = false }: TaxonNodeProps): ReactNode {
	const maxRankLevelShown = useAppStore((state) => state.maxRankLevelShown)
	const isDev = useAppStore((state) => state.isDev)

	const scrollTo = useContext(ScrollToContext)!

	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)

	const isHybrid = useMemo<boolean>(() => {
		return taxon.name.startsWith('x ')
	}, [taxon.name])

	const taxonNameWithoutHybrid = useMemo<string>(() => {
		return taxon.name.replace(/^x /, '')
	}, [taxon.name])

	const photos = useMemo<Photo[]>(() => {
		if (taxon.genderPhotos === undefined) return []
		if (condensed) return []
		return taxon.genderPhotos.flat()
	}, [taxon.genderPhotos, condensed])

	const handleTaxonNodeMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
		event.preventDefault()
	}

	const handleTaxonNodeMouseEnter = (): void => {
		setIsPopupOpen(true)
	}

	const handleTaxonNodeMouseLeave = (): void => {
		setIsPopupOpen(false)
	}

	const handlePhotoMouseDown = (photo: Photo, event: MouseEvent<HTMLDivElement>): void => {
		event.stopPropagation()
		if (checkIsDevEnv()) {
			const encodedPhotoUrl: string = textToBase64(photo.url)
			window.open(`view-box-photo-edit?encodedPhotoUrl=${encodedPhotoUrl}`, '_blank')
		} else {
			window.open(photo.url, '_blank')
		}
	}

	return (
		<Popper
			popperClassName="pointer-events-none z-40"
			isOpen={isPopupOpen}
			distance={8}
			padding={2}
			allowedPlacements={condensed ? ['right'] : ['left', 'right']}
			fallbackPlacements={['top-end', 'bottom-end']}
			hoverDelay={20}
			arrowClassName="fill-zinc-700/60"
			arrowRightClassName="fill-zinc-600/60"
			content={() => <TaxonPopupContent taxon={taxon} />}
		>
			<div
				className={clsx(
					'flex cursor-pointer items-center',
					checkIsIncertaeSedis(taxon) && 'pointer-events-none',
					condensed && 'w-full px-3',
					className
				)}
				onMouseDown={handleTaxonNodeMouseDown}
				onMouseUp={(event) => {
					handleTaxonNodeMouseUp(event, taxon, scrollTo)
				}}
				onMouseEnter={handleTaxonNodeMouseEnter}
				onMouseLeave={handleTaxonNodeMouseLeave}
			>
				<div className="mr-2 flex min-w-32 items-center">
					{taxon.candidatus && <div className="mr-1 text-zinc-500">Ca.</div>}
					{isHybrid && <div className="mr-1 text-zinc-500">x</div>}
					<div className={clsx('truncate', taxon.rank.colorClass)}>
						{taxonNameWithoutHybrid}
					</div>
					{taxon.extinct && <div className="ml-1 text-sm text-rose-400">{'\u2020'}</div>}
				</div>

				<div
					className={clsx(
						'flex min-w-0 items-center',
						'[&>:not(:last-child)]:after:content-middot',
						'[&>:not(:last-child)]:after:mx-2',
						'[&>:not(:last-child)]:after:text-zinc-400'
					)}
				>
					{taxon.textEn !== undefined && (
						<div className="truncate text-slate-400">{taxon.textEn}</div>
					)}
					{isDev && !condensed && !taxon.noCommonName && taxon.textEn === undefined && (
						<TaxonNodeTextEnHints taxon={taxon} setIsPopupOpen={setIsPopupOpen} />
					)}
					{!condensed && taxon.textVi !== undefined && (
						<div className="truncate text-stone-400">{taxon.textVi}</div>
					)}
					{!condensed && taxon.noCommonName && <div className="text-pink-400">???</div>}

					{!condensed && maxRankLevelShown < lastRank.level && (
						<div className="text-zinc-500">{taxon.children?.length ?? 0}</div>
					)}

					{photos.length > 0 && (
						<div className="flex items-center gap-2">
							{photos.map((photo) => (
								<img
									key={photo.url}
									className="max-h-4 max-w-5 rounded-sm bg-zinc-300 p-px select-none"
									src={photo.url}
									loading="lazy"
									onMouseDown={(event) => handlePhotoMouseDown(photo, event)}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</Popper>
	)
}
