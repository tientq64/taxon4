import clsx from 'clsx'
import { ReactNode } from 'react'
import { app, useApp } from '../store/app'
import { Icon } from './Icon'
import { SearchContent } from './SearchContent'

export function SearchPopup(): ReactNode {
	const { minimapVisible } = useApp()

	return (
		<div
			className={clsx(
				'absolute -top-px z-30 w-72 rounded-xl rounded-t-none border border-zinc-700 bg-zinc-900 px-3 pt-2 pb-1 shadow-lg shadow-zinc-950/80',
				minimapVisible ? 'right-47' : 'right-7'
			)}
		>
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
