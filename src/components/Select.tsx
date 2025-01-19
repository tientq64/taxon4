import clsx from 'clsx'
import { ChangeEvent, ReactNode } from 'react'

export interface SelectOption {
	label?: string | number
	value?: string | number
}

interface SelectProps {
	className?: string
	fill?: boolean
	value?: string | number
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
	options?: SelectOption[]
	children?: ReactNode
}

export function Select({
	className = '',
	fill,
	value,
	onChange,
	options,
	children
}: SelectProps): ReactNode {
	return (
		<select
			className={clsx(
				'h-7 rounded border border-zinc-600 bg-zinc-800 px-2 outline-none focus:border-blue-500',
				fill && 'w-full',
				className
			)}
			value={value}
			onChange={onChange}
		>
			{options === undefined && children}
			{options !== undefined &&
				options.map((option, index) => (
					<option key={index} value={option.value}>
						{option.label}
					</option>
				))}
		</select>
	)
}
