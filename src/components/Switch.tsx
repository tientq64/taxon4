import clsx from 'clsx'
import { ReactNode, useId } from 'react'

interface SwitchProps {
	disabled?: boolean
	fill?: boolean
	checked?: boolean
	onChange?: (checked: boolean) => void
	label?: ReactNode
	subLabel?: ReactNode
}

export function Switch({
	disabled,
	fill,
	checked,
	onChange,
	label,
	subLabel
}: SwitchProps): ReactNode {
	const id: string = useId()

	const handleSwitchToggle = (): void => {
		onChange?.(!checked)
	}

	return (
		<div
			className={clsx(
				'group inline-flex flex-col',
				fill && 'w-full',
				disabled && 'opacity-50'
			)}
		>
			<div className="flex items-center gap-2">
				<button
					role="switch"
					id={id}
					className={clsx(
						'relative flex h-5 w-10 cursor-pointer items-center rounded-md',
						checked ? 'bg-blue-600' : 'bg-zinc-700'
					)}
					type="button"
					disabled={disabled}
					aria-checked={Boolean(checked)}
					onClick={handleSwitchToggle}
				>
					<div
						className={clsx(
							'absolute left-0.5 size-4 rounded-[0.3125rem] bg-white transition-[translate,width]',
							!checked && 'translate-x-0 group-active:w-5',
							checked && 'translate-x-5 group-active:w-5 group-active:translate-x-4'
						)}
					/>
				</button>

				<label htmlFor={id} className="cursor-pointer text-zinc-400 select-none">
					{label}
				</label>
			</div>

			<label
				htmlFor={id}
				className="-mt-0.5 mb-1.5 ml-12 cursor-pointer text-xs text-zinc-500 select-none empty:hidden"
			>
				{subLabel}
			</label>
		</div>
	)
}
