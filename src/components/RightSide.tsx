import clsx from 'clsx'
import { ReactNode } from 'react'
import { useApp } from '../store/app'
import { LanguageFloatingButton } from './LanguageFloatingButton'
import { Minimap } from './Minimap'
import { SearchPopup } from './SearchPopup'
import { SearchResultMarkers } from './SearchResultMarkers'

export function RightSide(): ReactNode {
	const { isSearchPopupVisible, minimapVisible } = useApp()

	return (
		<div
			className={clsx(
				'pointer-events-none absolute top-0 right-4 -mr-px flex h-full',
				minimapVisible ? '' : ''
			)}
		>
			<div className="flex flex-col items-end pr-3">
				<div className="flex-1">{isSearchPopupVisible && <SearchPopup />}</div>
				<LanguageFloatingButton />
			</div>

			{minimapVisible && <Minimap />}

			{isSearchPopupVisible && <SearchResultMarkers />}
		</div>
	)
}
