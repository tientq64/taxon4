import clsx from 'clsx'
import { ReactNode, useId } from 'react'

interface SwitchProps {
	disabled?: boolean
	checked?: boolean
	onChange?: (checked: boolean) => void
	label?: ReactNode
	subLabel?: ReactNode
}

export function Switch({ disabled, checked, onChange, label, subLabel }: SwitchProps): ReactNode {
	const id: string = useId()

	const handleSwitchToggle = (): void => {
		onChange?.(!checked)
	}

	return (
		<div className={clsx(disabled && 'opacity-50', 'inline-flex flex-col')}>
			<div className="flex items-center gap-2">
				<button
					role="switch"
					id={id}
					className={clsx(
						'relative flex h-5 w-10 items-center rounded-md',
						checked ? 'bg-blue-600' : 'bg-zinc-700'
					)}
					type="button"
					disabled={disabled}
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

				<label htmlFor={id} className="cursor-pointer select-none text-zinc-400">
					{label}
				</label>
			</div>

			<label
				htmlFor={id}
				className="-mt-0.5 mb-1.5 ml-12 cursor-pointer select-none text-xs text-zinc-500 empty:hidden"
			>
				{subLabel}
			</label>
		</div>
	)
}
