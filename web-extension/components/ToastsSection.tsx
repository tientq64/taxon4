import { ReactNode } from 'react'
import { useExtStore } from '../store/useExtStore'

export function ToastsSection(): ReactNode {
	const toasts = useExtStore((state) => state.toasts)

	return (
		<div className="absolute bottom-1 right-2 flex w-64 flex-col items-end gap-0.5">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className="whitespace-pre-wrap rounded bg-gray-700 px-3 py-2 text-white"
				>
					{toast.message}
				</div>
			))}
		</div>
	)
}
