import clsx from 'clsx'
import { ReactNode } from 'react'
import { useAppStore } from '../store/useAppStore'
import { SearchContent } from './SearchContent'

export function SearchPopup(): ReactNode {
	const minimapShown = useAppStore((state) => state.minimapShown)

	return (
		<div
			className={clsx(
				minimapShown ? 'right-48' : 'right-8',
				'absolute top-px z-30 w-72 rounded-md rounded-t bg-zinc-700 px-3 py-1 shadow'
			)}
		>
			<SearchContent isPopup={true} />
		</div>
	)
}
