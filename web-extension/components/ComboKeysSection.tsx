import { ReactNode } from 'react'
import { useStore } from '../store/useStore'

export function ComboKeysSection(): ReactNode {
	const comboKeys = useStore((state) => state.comboKeys)

	return (
		<div className="flex justify-center items-end h-8 px-4 py-1 absolute bottom-1 w-full">
			<div className="flex-1 flex justify-center items-center">
				{comboKeys.filter(Boolean).length > 0 && (
					<div className="px-2 py-1 rounded bg-zinc-800 text-white">
						{comboKeys.filter(Boolean).join('+')}
					</div>
				)}
			</div>
		</div>
	)
}
