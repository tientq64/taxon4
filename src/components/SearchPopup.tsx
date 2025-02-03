import { ReactNode } from 'react'
import { SearchContent } from './SearchContent'

export function SearchPopup(): ReactNode {
	return (
		<div className="absolute right-48 top-px z-30 rounded-md rounded-t bg-zinc-700 px-3 py-1 shadow">
			<SearchContent isPopup={true} />
		</div>
	)
}
