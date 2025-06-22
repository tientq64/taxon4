import clsx from 'clsx'
import { ReactNode } from 'react'
import { app, useApp } from '../store/useAppStore'
import { Icon } from './Icon'
import { SearchContent } from './SearchContent'

export function SearchPopup(): ReactNode {
	const { minimapShown } = useApp()

	return (
		<div
			className={clsx(
				'absolute top-px z-30 w-72 rounded-lg rounded-t bg-zinc-700 px-3 pt-2 pb-1 shadow',
				minimapShown ? 'right-48' : 'right-8'
			)}
		>
			<SearchContent isPopup={true} />

			<button
				className="absolute top-2 right-3 flex cursor-pointer items-center justify-center rounded px-1 py-px hover:bg-zinc-600"
				onClick={() => (app.isSearchPopupVisible = false)}
			>
				<Icon className="text-[18px]!" name="close" />
			</button>
		</div>
	)
}
