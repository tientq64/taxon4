import { ReactNode } from 'react'
import { useStore } from '../store/useStore'

export function ToastsSection(): ReactNode {
	const toasts = useStore((state) => state.toasts)

	return (
		<div className="flex flex-col items-start gap-0.5 absolute left-2 bottom-1 w-64">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className="px-2 py-1 rounded whitespace-pre-wrap bg-zinc-800 text-white"
				>
					{toast.message}
				</div>
			))}
		</div>
	)
}
