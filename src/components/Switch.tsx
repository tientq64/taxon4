import clsx from 'clsx'
import { ReactNode, useId } from 'react'

type Props = {
	checked?: boolean
	onChange?: (checked: boolean) => void
	label?: ReactNode
}

export function Switch({ checked, onChange, label }: Props): ReactNode {
	const id: string = useId()

	const handleSwitchToggle = (): void => {
		onChange?.(!checked)
	}

	return (
		<div className="inline-flex items-center gap-2">
			<button
				role="switch"
				id={id}
				className={clsx(
					'flex items-center relative w-10 h-5 rounded-md',
					checked ? 'bg-blue-600' : 'bg-zinc-700'
				)}
				type="button"
				aria-checked={Boolean(checked)}
				onClick={handleSwitchToggle}
			>
				<div
					className={clsx(
						'absolute left-0.5 size-4 rounded-[0.3125rem] bg-white transition-transform',
						checked ? 'translate-x-5' : 'translate-x-0'
					)}
				/>
			</button>
			<label htmlFor={id} className="text-zinc-400 select-none cursor-pointer">
				{label}
			</label>
		</div>
	)
}
