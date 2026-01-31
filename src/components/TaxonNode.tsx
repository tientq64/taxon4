import clsx from 'clsx'
import { MouseEvent, ReactNode, useMemo, useState } from 'react'
import { textToBase64 } from '../../web-extension/utils/textToBase64'
import { lastRank } from '../constants/ranks'
import { checkIsDevEnv } from '../helpers/checkIsDevEnv'
import { countAllSubtaxa } from '../helpers/countAllSubtaxa'
import { getActiveTaxonFromVirtualTaxa } from '../helpers/getActiveTaxonFromVirtualTaxa'
import { getDataPartFileLineCount } from '../helpers/getDataPartFileLineCount'
import { handleTaxonNodeMouseUp } from '../helpers/handleTaxonNodeMouseUp'
import { Photo, Taxon } from '../helpers/parse'
import { app, useApp } from '../store/app'
import { ref } from '../utils/ref'
import { Popper } from './Popper'
import { TaxonNodeTextEnHints } from './TaxonNodeTextEnHints'
import { TaxonPopupContent } from './TaxonPopupContent'

export interface TaxonNodeProps {
	/** Đơn vị phân loại của hàng này. */
	taxon: Taxon

	className?: string

	/** Nếu `true`, chỉ hiển thị một số thông tin cơ bản. */
	condensed?: boolean
}

/**
 * Một nút chứa nội dung của một hàng trong trình xem danh sách các đơn vị phân loại.
 * Không chứa phần đường kẻ thụt lề.
 */
export function TaxonNode({ taxon, className, condensed = false }: TaxonNodeProps): ReactNode {
	const { maxRankLevelShown, developerModeEnabled } = useApp()

	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)

	const sign = useMemo<string | undefined>(() => {
		if (taxon.name.startsWith('x ')) return 'x'
		if (taxon.name.startsWith('+ ')) return '+'
	}, [taxon.name])

	const taxonNameWithoutSign = useMemo<string>(() => {
		return taxon.name.replace(/^[x+] /, '')
	}, [taxon.name])

	const photos = useMemo<Photo[]>(() => {
		if (taxon.genderPhotos === undefined) return []
		if (condensed) return []
		return taxon.genderPhotos.flat()
	}, [taxon.genderPhotos, condensed])

	const isShowCounter: boolean = !condensed && maxRankLevelShown < lastRank.level

	const allSubtaxaCount = useMemo<number>(() => {
		if (!isShowCounter) return 0
		return countAllSubtaxa(taxon, true)
	}, [taxon, isShowCounter])

	const dataPartFileLineCount = useMemo<number>(() => {
		if (!isShowCounter) return 0
		return getDataPartFileLineCount(taxon)
	}, [taxon, isShowCounter])

	const handleTaxonNodeMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
		event.preventDefault()
	}

	const handleTaxonNodeMouseEnter = (): void => {
		setIsPopupOpen(true)
		if (!condensed) {
			app.activeTaxon = ref(taxon)
		}
	}

	const handleTaxonNodeMouseLeave = (): void => {
		setIsPopupOpen(false)
		if (!condensed) {
			app.activeTaxon = ref(getActiveTaxonFromVirtualTaxa())
		}
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
			arrowClassName="fill-[#2f2f35]"
			arrowRightClassName="fill-[#393941]"
			content={() => <TaxonPopupContent taxon={taxon} />}
		>
			<div
				className={clsx('flex cursor-pointer items-center', className)}
				onMouseDown={handleTaxonNodeMouseDown}
				onMouseUp={(event) => {
					handleTaxonNodeMouseUp(event, taxon)
				}}
				onMouseEnter={handleTaxonNodeMouseEnter}
				onMouseLeave={handleTaxonNodeMouseLeave}
			>
				<div className="mr-2 flex min-w-32 items-center">
					{taxon.candidatus && <div className="mr-1 text-zinc-500">Ca.</div>}
					{sign !== undefined && <div className="mr-1 text-zinc-500">{sign}</div>}
					<div className={clsx('truncate', taxon.rank.colorClass)}>
						{taxonNameWithoutSign}
					</div>
					{taxon.extinct && <div className="ml-1 text-sm text-rose-300">{'\u2020'}</div>}
				</div>

				<div className="flex min-w-0 items-center gap-2">
					{!condensed && taxon.textEn !== undefined && (
						<div className="min-w-48 truncate text-slate-400">{taxon.textEn}</div>
					)}
					{developerModeEnabled &&
						!condensed &&
						!taxon.noCommonName &&
						taxon.textEn === undefined && (
							<TaxonNodeTextEnHints taxon={taxon} setIsPopupOpen={setIsPopupOpen} />
						)}
					{!condensed && taxon.textVi !== undefined && (
						<div className="min-w-48 truncate text-stone-400">{taxon.textVi}</div>
					)}
					{!condensed && taxon.noCommonName && <div className="text-pink-400">???</div>}

					{isShowCounter && (
						<div
							className={clsx(
								'flex items-center gap-12 text-sm',
								taxon.dataPartFileLineCount ? 'text-teal-300/50' : 'text-zinc-600'
							)}
						>
							{allSubtaxaCount}
							{!taxon.dataPartFileLineCount && (
								<small className="text-xs text-zinc-700">
									{dataPartFileLineCount}
								</small>
							)}
						</div>
					)}

					{photos.length > 0 && (
						<div className="flex items-center gap-1">
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
