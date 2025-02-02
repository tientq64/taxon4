import { MouseEvent, ReactNode, useContext, useMemo } from 'react'
import { copyText } from '../../web-extension/utils/clipboard'
import { ScrollToContext } from '../App'
import { Taxon } from '../helpers/parse'
import { useAppStore } from '../store/useAppStore'
import { Popper } from './Popper'
import { TaxonIcon } from './TaxonIcon'
import { TaxonPopupContent } from './TaxonPopupContent'

/**
 * Mục các biểu tượng.
 */
export function IconsPanel(): ReactNode {
	const taxa = useAppStore((state) => state.taxa)
	const scrollTo = useContext(ScrollToContext)!

	const iconTaxa = useMemo<Taxon[]>(() => {
		return taxa.filter((taxon) => taxon.icon !== undefined)
	}, [taxa])

	const handleIconMouseDown = (taxon: Taxon, event: MouseEvent<HTMLButtonElement>): void => {
		event.preventDefault()
		if (taxon.icon === undefined) return

		switch (event.button) {
			case 0:
				scrollTo(taxon)
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
					{iconTaxa.map((taxon, index) => (
						<Popper
							key={index}
							popperClassName="pointer-events-none z-40"
							distance={8}
							padding={2}
							allowedPlacements={['left', 'right']}
							fallbackPlacements={['top-end', 'bottom-end']}
							hoverDelay={10}
							arrowClassName="fill-zinc-700/60"
							arrowRightClassName="fill-zinc-600/60"
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

			<div className="border-t border-zinc-700 px-3">{iconTaxa.length} icon</div>
		</div>
	)
}
