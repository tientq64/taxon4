import clsx from 'clsx'
import {
	memo,
	MouseEvent,
	ReactNode,
	SyntheticEvent,
	useCallback,
	useContext,
	useMemo
} from 'react'
import { lastRank } from '../../web-extension/models/Ranks'
import { copyText } from '../../web-extension/utils/clipboard'
import { AppContext } from '../App'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { getTaxonQueryName } from '../helpers/getTaxonQueryName'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { isIncertaeSedis } from '../helpers/isIncertaeSedis'
import { Photo, Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'
import { Popper } from './Popper'
import { TaxonNodePopoverContent } from './TaxonNodePopoverContent'

type Props = {
	taxon: Taxon
	index?: number
	hiddenIndent?: boolean
	hiddenTextVi?: boolean
	hiddenNoCommonName?: boolean
	hiddenChildrenCount?: boolean
	hiddenPhotos?: boolean
	labelClassName?: string
	fillLabel?: boolean
}

function openUrl(url: string): void {
	if (!url) return
	window.open(url, '_blank')
}

export const TaxonNode = memo(function ({
	taxon,
	index = taxon.index,
	hiddenIndent = false,
	hiddenTextVi = false,
	hiddenNoCommonName = false,
	hiddenChildrenCount = false,
	hiddenPhotos = false,
	labelClassName,
	fillLabel = false
}: Props): ReactNode {
	const rankLevelWidth = useStore((state) => state.rankLevelWidth)
	const maxRankLevelShown = useStore((state) => state.maxRankLevelShown)
	const keyCode = useStore((state) => state.keyCode)

	const { scrollTo } = useContext(AppContext)!

	const taxonParents = useMemo<Taxon[]>(() => {
		return getTaxonParents(taxon)
	}, [taxon])

	const photos = useMemo<Photo[]>(() => {
		if (taxon.genderPhotos === undefined) return []
		if (hiddenPhotos) return []
		return taxon.genderPhotos.flat()
	}, [taxon.genderPhotos, hiddenPhotos])

	const shownTextVi = useMemo<boolean>(() => {
		return taxon.textVi !== undefined && !hiddenTextVi
	}, [taxon.textVi, hiddenTextVi])

	const shownNoCommonName = useMemo<boolean>(() => {
		return taxon.noCommonName && !hiddenNoCommonName
	}, [taxon.noCommonName, hiddenNoCommonName])

	const shownChildrenCount = useMemo<boolean>(() => {
		return maxRankLevelShown < lastRank.level && !hiddenChildrenCount
	}, [maxRankLevelShown, hiddenChildrenCount])

	const shownPhotos = useMemo<boolean>(() => {
		return photos.length > 0 && !hiddenPhotos
	}, [photos, hiddenPhotos])

	const handlePhotoLoadEnd = useCallback((event: SyntheticEvent<HTMLImageElement>): void => {
		event.currentTarget.classList.remove('w-5', 'h-4')
	}, [])

	const handleTaxonLabelMouseDown = useCallback((event: MouseEvent<HTMLDivElement>): void => {
		event.preventDefault()
	}, [])

	const handleTaxonLabelMouseUp = useCallback(
		(event: MouseEvent<HTMLDivElement>): void => {
			event.preventDefault()
			const button: number = event.button
			let url: string = ''
			let q: string = getTaxonQueryName(taxon)

			switch (button) {
				case 0:
					{
						if (event.ctrlKey) {
							scrollTo(taxon)
						} else {
							switch (keyCode) {
								case 'KeyC':
									url = `https://www.google.com/search?q=${q}+common+name`
									break
								case 'KeyN':
									url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}`
									break
								default:
									const lang: string = event.altKey ? 'vi' : 'en'
									q = getTaxonWikipediaQueryName(taxon, lang)
									url = `https://${lang}.wikipedia.org/wiki/${q}`
									break
							}
							openUrl(url)
						}
					}
					break

				case 1:
					{
						switch (keyCode) {
							case 'KeyN':
								url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}&isCommonName`
								break
							default:
								if (event.altKey) {
									const fullName: string = getTaxonFullName(taxon)
									copyText(fullName)
								} else {
									url = `https://www.google.com/search?q=${q}+common+name`
								}
								break
						}
						openUrl(url)
					}
					break

				case 2:
					{
						if (event.altKey) {
							url = `https://www.google.com/search?q=${q}&udm=2`
						} else {
							url = `https://www.flickr.com/search/?text=${q}`
						}
						openUrl(url)
					}
					break
			}
		},
		[taxon, keyCode]
	)

	return (
		<div
			className={clsx('relative flex items-center w-full h-6', index % 2 && 'bg-zinc-800/20')}
			style={{
				paddingLeft: hiddenIndent ? 0 : taxon.rank.level * rankLevelWidth
			}}
		>
			{!hiddenIndent &&
				taxonParents.map((parent) => (
					<div
						className="absolute h-full border-l border-zinc-700"
						style={{
							left: parent.rank.level * rankLevelWidth
						}}
					/>
				))}

			<Popper
				popperClassName="pointer-events-none z-40"
				distance={8}
				padding={2}
				allowedPlacements={['left', 'right']}
				fallbackPlacements={['top-end', 'bottom-end']}
				hoverDelay={10}
				arrowClassName="fill-zinc-100"
				content={() => <TaxonNodePopoverContent taxon={taxon} />}
			>
				<div
					className={clsx(
						'flex items-center cursor-pointer z-10',
						isIncertaeSedis(taxon) && 'pointer-events-none',
						fillLabel && 'w-full',
						labelClassName
					)}
					onMouseDown={handleTaxonLabelMouseDown}
					onMouseUp={handleTaxonLabelMouseUp}
				>
					<div
						className={clsx(
							'flex items-center',
							(taxon.textEn ||
								shownTextVi ||
								shownNoCommonName ||
								shownChildrenCount ||
								shownPhotos) &&
								'min-w-32 mr-2'
						)}
					>
						<div className={clsx('truncate', taxon.rank.colorClass)}>{taxon.name}</div>
						{taxon.extinct && <div className="ml-1 text-rose-400">{'\u2020'}</div>}
					</div>

					{taxon.textEn && <div className="truncate text-slate-400">{taxon.textEn}</div>}
					{shownTextVi && (
						<>
							{taxon.textEn && <div className="mx-2 text-stone-400">&middot;</div>}
							<div className="truncate text-stone-400">{taxon.textVi}</div>
						</>
					)}

					{shownNoCommonName && (
						<>
							{(taxon.textEn || shownTextVi) && (
								<div className="mx-2 text-stone-400">&middot;</div>
							)}
							<div className="text-pink-400">???</div>
						</>
					)}

					{shownChildrenCount && (
						<>
							{(taxon.textEn || shownTextVi || shownNoCommonName) && (
								<div className="mx-2 text-stone-400">&middot;</div>
							)}
							<div className="line-clamp-1 text-pink-400">
								{taxon.children?.length ?? 0}
							</div>
						</>
					)}
				</div>
			</Popper>

			{photos.length > 0 && (
				<div className="flex items-center">
					{(taxon.textEn || shownTextVi || shownNoCommonName || shownChildrenCount) && (
						<div className="mx-2 text-stone-400">&middot;</div>
					)}
					<div className="flex items-center gap-2">
						{photos.map((photo) => (
							<img
								className="max-w-5 max-h-4 w-5 h-4 rounded-sm"
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
})
