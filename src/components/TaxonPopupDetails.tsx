import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { countAllSubtaxa } from '../helpers/countAllSubtaxa'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/app'

interface TaxonPopupDetailsProps {
	taxon: Taxon
}

export function TaxonPopupDetails({ taxon }: TaxonPopupDetailsProps): ReactNode {
	const { developerModeEnabled } = useApp()
	const { t } = useTranslation()

	const hasSomeCaption = useMemo<boolean>(() => {
		if (taxon.genderPhotos === undefined) return false
		if (taxon.genderPhotos.length >= 2) return true
		return taxon.genderPhotos.flat().some((photo) => photo.caption !== undefined)
	}, [taxon.genderPhotos])

	const allSubtaxaCount = useMemo<number>(() => {
		if (!developerModeEnabled) return 0
		return countAllSubtaxa(taxon)
	}, [taxon, developerModeEnabled])

	return (
		<div
			className={clsx(
				'flex min-w-80 flex-wrap gap-y-1 border-b border-zinc-500/80 py-2 text-left leading-none',
				(taxon.genderPhotos === undefined || hasSomeCaption) && 'border-t'
			)}
		>
			<div className="flex w-1/2 gap-3">
				{t('taxonPopup.rank')}:{' '}
				<div className="text-zinc-400">{t(`ranks.${taxon.rank.name}.name`)}</div>
			</div>

			{taxon.children?.[0] && (
				<div className="flex w-1/2 gap-3">
					{t('taxonPopup.include')}:
					<div className="text-zinc-400 lowercase">
						{taxon.children.length} {t(`ranks.${taxon.children[0].rank.name}.name`)}
					</div>
				</div>
			)}

			{developerModeEnabled && (
				<div className="flex w-1/2 gap-3">
					Chứa:
					<div className="text-zinc-400">{allSubtaxaCount} taxon</div>
				</div>
			)}
		</div>
	)
}
