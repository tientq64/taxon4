import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Taxon } from '../helpers/parse'

interface TaxonPopupDetailsProps {
	taxon: Taxon
}

export function TaxonPopupDetails({ taxon }: TaxonPopupDetailsProps): ReactNode {
	const { t } = useTranslation()

	const hasSomeCaption = useMemo<boolean>(() => {
		if (taxon.genderPhotos === undefined) return false
		if (taxon.genderPhotos.length >= 2) return true
		return taxon.genderPhotos.flat().some((photo) => photo.caption !== undefined)
	}, [taxon.genderPhotos])

	return (
		<div
			className={clsx(
				'flex min-w-80 flex-wrap border-b border-zinc-500/80 py-1 text-left',
				(taxon.genderPhotos === undefined || hasSomeCaption) && 'border-t'
			)}
		>
			<div className="flex w-1/2 gap-3">
				{t('taxonPopup.rank')}:<div className="text-zinc-400">{taxon.rank.textVi}</div>
			</div>

			{taxon.children?.[0] && (
				<div className="flex w-1/2 gap-3">
					{t('taxonPopup.include')}:
					<div className="text-zinc-400 lowercase">
						{taxon.children.length} {taxon.children[0].rank.textVi}
					</div>
				</div>
			)}
		</div>
	)
}
