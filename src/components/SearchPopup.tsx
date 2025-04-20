import clsx from 'clsx'
import { ReactNode } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Icon } from './Icon'
import { SearchContent } from './SearchContent'

export function SearchPopup(): ReactNode {
	const minimapShown = useAppStore((state) => state.minimapShown)
	const setIsSearchPopupVisible = useAppStore((state) => state.setIsSearchPopupVisible)

	return (
		<div
			className={clsx(
				'absolute top-px z-30 w-72 rounded-lg rounded-t bg-zinc-700 px-3 pb-1 pt-2 shadow',
				minimapShown ? 'right-48' : 'right-8'
			)}
		>
			<SearchContent isPopup={true} />

			<button
				className="absolute right-3 top-2 flex items-center justify-center rounded p-px hover:bg-zinc-600"
				onClick={() => setIsSearchPopupVisible(false)}
			>
				<Icon className="text-[18px]" name="close" />
			</button>
		</div>
	)
}
