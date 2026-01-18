import { ReactNode } from 'react'
import { app } from '../store/app'
import { Icon } from './Icon'
import { SearchContent } from './SearchContent'

export function SearchPopup(): ReactNode {
	return (
		<div className="pointer-events-auto relative z-30 -mt-px w-72 rounded-xl rounded-t-none border border-zinc-700 bg-zinc-900 p-3 pt-2 shadow-lg shadow-zinc-950/80">
			<SearchContent isPopup />

			<button
				className="absolute top-2 right-3 flex cursor-pointer items-center justify-center rounded px-1 py-px hover:bg-zinc-700"
				onClick={() => (app.isSearchPopupVisible = false)}
			>
				<Icon className="text-[18px]!" name="close" />
			</button>
		</div>
	)
}
