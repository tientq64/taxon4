import clsx from 'clsx'
import { ReactNode, useMemo } from 'react'
import { Taxon } from '../helpers/parse'

interface Props {
	taxon: Taxon
}

export function TaxonPopupDetails({ taxon }: Props): ReactNode {
	const hasSomeCaption = useMemo<boolean>(() => {
		if (taxon.genderPhotos === undefined) return false
		if (taxon.genderPhotos.length >= 2) return true
		return taxon.genderPhotos.flat().some((photo) => photo.caption !== undefined)
	}, [taxon.genderPhotos])

	return (
		<div
			className={clsx(
				'flex min-w-80 flex-wrap border-b border-zinc-300/80 pt-1 text-left',
				(taxon.genderPhotos === undefined || hasSomeCaption) && 'border-t'
			)}
		>
			<div className="flex w-1/2 gap-3">
				Bậc:
				<div className="text-zinc-600">{taxon.rank.textVi}</div>
			</div>

			{taxon.children?.[0] && (
				<div className="flex w-1/2 gap-3">
					Gồm:
					<div className="lowercase text-zinc-600">
						{taxon.children.length} {taxon.children[0].rank.textVi}
					</div>
				</div>
			)}
		</div>
	)
}
