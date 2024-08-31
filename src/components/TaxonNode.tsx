import { useEventListener } from 'ahooks'
import clsx from 'clsx'
import { memo, MouseEvent, ReactNode, SyntheticEvent, useContext, useMemo, useState } from 'react'
import { copyText } from '../../web-extension/utils/clipboard'
import { AppContext } from '../App'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { getTaxonParents } from '../helpers/getTaxonParents'
import { getTaxonQueryName } from '../helpers/getTaxonQueryName'
import { getTaxonWikipediaQueryName } from '../helpers/getTaxonWikipediaQueryName'
import { isIncertaeSedis } from '../helpers/isIncertaeSedis'
import { Photo, Taxon } from '../helpers/parse'
import { Popper } from './Popper'
import { TaxonNodePopoverContent } from './TaxonNodePopoverContent'

type Props = {
	taxon: Taxon
	index: number
}

export const TaxonNode = memo(function ({ taxon, index }: Props): ReactNode {
	const { rankLevelWidth } = useContext(AppContext)!
	const [keyCode, setKeyCode] = useState<string>('')

	const photos = useMemo<Photo[]>(() => {
		return taxon.genderPhotos?.flat().filter((photo) => photo !== undefined) ?? []
	}, [])

	const handlePhotoLoadEnd = (event: SyntheticEvent<HTMLImageElement>): void => {
		event.currentTarget.classList.remove('w-5', 'h-4')
	}

	const handleTaxonLabelMouseUp = (event: MouseEvent<HTMLDivElement>): void => {
		const button: number = event.button

		switch (button) {
			case 0:
				{
					const lang: string = event.altKey ? 'vi' : 'en'
					const q: string = getTaxonWikipediaQueryName(taxon, lang)
					window.open(`https://${lang}.wikipedia.org/wiki/${q}`, '_blank')
				}
				break

			case 1:
				{
					event.preventDefault()
					if (event.altKey) {
						const q: string = getTaxonQueryName(taxon)
						window.open(`https://www.google.com/search?q=${q}+common+name`, '_blank')
					} else {
						const fullName: string = getTaxonFullName(taxon)
						copyText(fullName)
					}
				}
				break

			case 2:
				{
					const q: string = getTaxonQueryName(taxon)
					if (event.altKey) {
						window.open(`https://www.google.com/search?q=${q}&udm=2`, '_blank')
					} else {
						window.open(`https://www.flickr.com/search/?text=${q}`, '_blank')
					}
				}
				break
		}
	}

	const handleTaxonLabelMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
		event.preventDefault()
	}

	const handleGlobalKeyDown = (event: KeyboardEvent): void => {
		if (event.repeat) return
		setKeyCode(event.code)
	}

	useEventListener('keydown', handleGlobalKeyDown)

	return (
		<div
			className={clsx('relative flex items-center w-full h-6', index % 2 && 'bg-zinc-800/20')}
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
						'flex items-center cursor-pointer',
						isIncertaeSedis(taxon) && 'pointer-events-none'
					)}
					onMouseUp={handleTaxonLabelMouseUp}
					onMouseDown={handleTaxonLabelMouseDown}
				>
					<div
						className={clsx(
							'flex items-center',
							(taxon.noCommonName ||
								taxon.textEn ||
								taxon.textVi ||
								photos.length > 0) &&
								'min-w-32 mr-2'
						)}
					>
						<div className={taxon.rank.colorClass}>{taxon.name}</div>
						{taxon.extinct && <div className="ml-1 text-rose-400">{'\u2020'}</div>}
					</div>

					{taxon.textEn && <div className="text-slate-400">{taxon.textEn}</div>}
					{taxon.textVi && (
						<>
							{(taxon.textEn || taxon.noCommonName) && (
								<div className="mx-2 text-stone-400">&middot;</div>
							)}
							<div className="text-stone-400">{taxon.textVi}</div>
						</>
					)}

					{taxon.noCommonName && <div className="text-pink-400">???</div>}
				</div>
			</Popper>

			{photos.length > 0 && (
				<div className="flex items-center">
					{(taxon.textEn || taxon.textVi || taxon.noCommonName) && (
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
})
