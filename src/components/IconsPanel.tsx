import { MouseEvent, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { copyText } from '../../web-extension/utils/clipboard'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/app'
import { Link } from './Link'
import { Popper } from './Popper'
import { TaxonIcon } from './TaxonIcon'
import { TaxonPopupContent } from './TaxonPopupContent'

/** Mục các biểu tượng. */
export function IconsPanel(): ReactNode {
	const { taxa, scrollToTaxon } = useApp()
	const { t } = useTranslation()

	const taxaHasIcon = useMemo<Taxon[]>(() => {
		return taxa.filter((taxon) => taxon.icon !== undefined) as Taxon[]
	}, [taxa])

	const handleIconMouseDown = (taxon: Taxon, event: MouseEvent<HTMLButtonElement>): void => {
		event.preventDefault()
		if (taxon.icon === undefined) return

		switch (event.button) {
			case 0:
				scrollToTaxon?.(taxon)
				break
			case 1:
				copyText(taxon.icon)
				break
		}
	}

	return (
		<div className="flex h-full flex-col">
			<div className="scrollbar-overlay flex-1 overflow-auto px-3 pb-1" tabIndex={0}>
				<div className="flex flex-wrap gap-x-3 gap-y-1">
					{taxaHasIcon.map((taxon, index) => (
						<Popper
							key={index}
							popperClassName="pointer-events-none z-40"
							distance={8}
							padding={2}
							allowedPlacements={['left', 'right']}
							fallbackPlacements={['top-end', 'bottom-end']}
							hoverDelay={10}
							arrowClassName="fill-[#2f2f35]"
							arrowRightClassName="fill-[#393941]"
							content={() => <TaxonPopupContent taxon={taxon} />}
						>
							<button
								className="cursor-pointer"
								onMouseDown={handleIconMouseDown.bind(null, taxon)}
							>
								<TaxonIcon taxon={taxon} />
							</button>
						</Popper>
					))}
				</div>
			</div>

			<div className="flex justify-between border-t border-zinc-700 px-3">
				<div>{t('icons.count', { count: taxaHasIcon.length })}</div>
				<div>
					{t('icons.source')}: <Link href="https://flaticon.com">Flaticon</Link>
				</div>
			</div>
		</div>
	)
}
