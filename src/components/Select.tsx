import clsx from 'clsx'
import { ChangeEvent, ReactNode } from 'react'

export type SelectOption = {
	label?: string | number
	value?: string | number
}

type Props = {
	className?: string
	fill?: boolean
	value?: string | number
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
	options?: SelectOption[]
}

export function Select({ className = '', fill, options, value, onChange }: Props): ReactNode {
	return (
		<select
			className={clsx(
				'h-7 px-2 border border-zinc-600 focus:border-blue-500 rounded bg-zinc-800 outline-none',
				fill && 'w-full',
				className
			)}
			value={value}
			onChange={onChange}
		>
			{options?.map((option) => (
				<option value={option.value}>{option.label}</option>
			))}
		</select>
	)
}
