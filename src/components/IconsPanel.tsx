import { filter } from 'lodash-es'
import { MouseEvent, ReactNode, useContext, useMemo } from 'react'
import { copyText } from '../../web-extension/utils/clipboard'
import { ScrollToContext } from '../App'
import { Taxon } from '../helpers/parse'
import { useStore } from '../store/useStore'
import { Popper } from './Popper'
import { TaxonIcon } from './TaxonIcon'
import { TaxonNodePopoverContent } from './TaxonNodePopoverContent'

export function IconsPanel(): ReactNode {
	const taxa = useStore((state) => state.taxa)
	const scrollTo = useContext(ScrollToContext)!

	const iconTaxa = useMemo<Taxon[]>(() => {
		return filter(taxa, 'icon')
	}, [taxa])

	const handleIconMouseDown = (taxon: Taxon, event: MouseEvent<HTMLDivElement>): void => {
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
		<div className="flex flex-col h-full">
			<div className="flex-1 px-3 pb-1 overflow-auto scrollbar-overlay">
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
							arrowClassName="fill-zinc-100"
							content={() => <TaxonNodePopoverContent taxon={taxon} />}
						>
							<div
								className="cursor-pointer"
								onMouseDown={handleIconMouseDown.bind(null, taxon)}
							>
								<TaxonIcon icon={taxon.icon!} />
							</div>
						</Popper>
					))}
				</div>
			</div>

			<div className="px-3 border-t border-zinc-700">{iconTaxa.length} icon</div>
		</div>
	)
}
