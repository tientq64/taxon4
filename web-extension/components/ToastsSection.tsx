import { ReactNode } from 'react'
import { useExtStore } from '../store/useExtStore'

export function ToastsSection(): ReactNode {
	const toasts = useExtStore((state) => state.toasts)

	return (
		<div className="absolute bottom-1 left-2 flex w-64 flex-col items-start gap-0.5">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className="whitespace-pre-wrap rounded bg-zinc-800 px-2 py-1 text-white"
				>
					{toast.message}
				</div>
			))}
		</div>
	)
}
