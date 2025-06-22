import { ReactNode } from 'react'
import { useExt } from '../store/ext'

export function ComboKeysSection(): ReactNode {
	const { comboKeys } = useExt()

	return (
		<div className="absolute bottom-1 flex h-8 w-full items-end justify-center px-4 py-1">
			<div className="flex flex-1 items-center justify-center">
				{comboKeys.filter(Boolean).length > 0 && (
					<div className="rounded bg-zinc-800 px-2 py-1 text-white">
						{comboKeys.filter(Boolean).join('+')}
					</div>
				)}
			</div>
		</div>
	)
}
