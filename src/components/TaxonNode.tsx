import clsx from 'clsx'
import {
	MouseEvent,
	ReactElement,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState
} from 'react'
import { lastRank } from '../../web-extension/models/Ranks'
import { copyText } from '../../web-extension/utils/clipboard'
import { ScrollToContext } from '../App'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { getTaxonQueryName } from '../helpers/getTaxonQueryName'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { isIncertaeSedis } from '../helpers/isIncertaeSedis'
import { Photo, Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'
import { openUrl } from '../utils/openUrl'
import { Popper } from './Popper'
import { TaxonNodeTextEnHints } from './TaxonNodeTextEnHints'
import { TaxonPopupContent } from './TaxonPopupContent'

export type TaxonNodeProps = {
	taxon: Taxon
	className?: string
	advanced?: boolean
}

export function TaxonNode({ taxon, className, advanced = false }: TaxonNodeProps): ReactNode {
	const maxRankLevelShown = useStore((state) => state.maxRankLevelShown)
	const keyCode = useStore((state) => state.keyCode)
	const isDev = useStore((state) => state.isDev)

	const scrollTo = useContext(ScrollToContext)!

	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)

	const photos = useMemo<Photo[]>(() => {
		if (taxon.genderPhotos === undefined) return []
		if (!advanced) return []
		return taxon.genderPhotos.flat()
	}, [taxon.genderPhotos, advanced])

	const handleTaxonNodeMouseDown = useCallback((event: MouseEvent<HTMLDivElement>): void => {
		event.preventDefault()
	}, [])

	const handleTaxonNodeMouseUp = useCallback(
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
							case 'KeyC':
								const fullName: string = getTaxonFullName(taxon)
								copyText(fullName)
								break
							default:
								if (event.altKey) {
									url = `https://www.google.com/search?q=${q}+common+name`
								} else {
									url = `https://www.inaturalist.org/taxa/search?view=list&q=${q}&isCommonName`
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

	const handleTaxonNodeMouseEnter = useCallback((): void => {
		setIsPopupOpen(true)
	}, [])

	const handleTaxonNodeMouseLeave = useCallback((): void => {
		setIsPopupOpen(false)
	}, [])

	const renderPopupContent = useCallback((): ReactElement => {
		return <TaxonPopupContent taxon={taxon} />
	}, [taxon])

	return (
		<Popper
			popperClassName="pointer-events-none z-40"
			isOpen={isPopupOpen}
			distance={8}
			padding={2}
			allowedPlacements={advanced ? ['left', 'right'] : ['right']}
			fallbackPlacements={['top-end', 'bottom-end']}
			hoverDelay={10}
			arrowClassName="fill-zinc-100"
			content={renderPopupContent}
		>
			<div
				className={clsx(
					'flex items-center cursor-pointer z-10',
					isIncertaeSedis(taxon) && 'pointer-events-none',
					!advanced && 'w-full px-3',
					className
				)}
				onMouseDown={handleTaxonNodeMouseDown}
				onMouseUp={handleTaxonNodeMouseUp}
				onMouseEnter={handleTaxonNodeMouseEnter}
				onMouseLeave={handleTaxonNodeMouseLeave}
			>
				<div className="flex items-center min-w-32 mr-2">
					<div className={clsx('truncate', taxon.rank.colorClass)}>{taxon.name}</div>
					{taxon.extinct && <div className="ml-1 text-sm text-rose-400">{'\u2020'}</div>}
				</div>

				<div
					className={clsx(
						'flex items-center min-w-0',
						'[&>:not(:last-child)]:after:content-middot',
						'[&>:not(:last-child)]:after:mx-2',
						'[&>:not(:last-child)]:after:text-zinc-400'
					)}
				>
					{taxon.textEn !== undefined && (
						<div className="truncate text-slate-400">{taxon.textEn}</div>
					)}
					{isDev && advanced && !taxon.noCommonName && taxon.textEn === undefined && (
						<TaxonNodeTextEnHints taxon={taxon} setIsPopupOpen={setIsPopupOpen} />
					)}
					{advanced && taxon.textVi !== undefined && (
						<div className="truncate text-stone-400">{taxon.textVi}</div>
					)}
					{advanced && taxon.noCommonName && <div className="text-pink-400">???</div>}

					{advanced && maxRankLevelShown < lastRank.level && (
						<div className="text-zinc-500">{taxon.children?.length ?? 0}</div>
					)}

					{photos.length > 0 && (
						<div className="flex items-center gap-2">
							{photos.map((photo) => (
								<img
									key={photo.url}
									className="max-w-5 max-h-4 rounded-sm"
									src={photo.url}
									loading="lazy"
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</Popper>
	)
}
