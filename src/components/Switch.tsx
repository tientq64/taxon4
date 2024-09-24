import clsx from 'clsx'
import { ChangeEvent, ReactNode } from 'react'

type Props = {
	checked?: boolean
	onChange?: (checked: boolean) => void
	label?: ReactNode
}

export function Switch({ checked, onChange, label }: Props): ReactNode {
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
		onChange?.(event.target.checked)
	}

	return (
		<label className="inline-flex items-center gap-2 cursor-pointer">
			<div
				role="checkbox"
				className={clsx(
					'flex items-center relative w-10 h-5 rounded-full',
					checked ? 'bg-blue-600' : 'bg-zinc-700'
				)}
				aria-checked={checked}
			>
				<div
					className={clsx(
						'absolute left-0.5 size-4 rounded-full bg-white transition-transform',
						checked ? 'translate-x-5' : 'translate-x-0'
					)}
				></div>
			</div>
			<div className="text-zinc-400 select-none">{label}</div>
			<input type="checkbox" hidden checked={checked} onChange={handleCheckboxChange} />
		</label>
	)
}
