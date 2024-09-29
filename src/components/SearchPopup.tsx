import { ReactNode } from 'react'
import { SearchContent } from './SearchContent'

export function SearchPopup(): ReactNode {
	return (
		<div className="absolute top-2 right-48 z-30">
			<SearchContent isPopup={true} />
		</div>
	)
}
