import { ReactNode } from 'react'
import { useExt } from '../store/ext'

export function ToastsSection(): ReactNode {
	const { toasts } = useExt()

	return (
		<div className="absolute right-2 bottom-1 flex w-64 flex-col items-end gap-0.5">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className="rounded bg-gray-700 px-3 py-2 whitespace-pre-wrap text-white"
				>
					{toast.message}
				</div>
			))}
		</div>
	)
}
