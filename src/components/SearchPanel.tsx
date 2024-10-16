import { ReactNode } from 'react'
import { SearchContent } from './SearchContent'

export function SearchPanel(): ReactNode {
	return (
		<div className="flex flex-col gap-2 px-3">
			<div>
				<SearchContent />
			</div>
		</div>
	)
}
