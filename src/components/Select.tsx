import { ChangeEvent, ReactNode } from 'react'

export type SelectOption = {
	label: string
	value: string
}

type Props = {
	className?: string
	fill?: boolean
	value: string
	onChange: (event: ChangeEvent<HTMLSelectElement>) => void
	options: SelectOption[]
}

export function Select({ className = '', fill, options, value, onChange }: Props): ReactNode {
	return (
		<select
			className={`
				h-7 px-2 border border-zinc-600 focus:border-blue-500 rounded bg-zinc-800 outline-none
				${className}
				${fill ? 'w-full' : ''}
			`}
			value={value}
			onChange={onChange}
		>
			{options.map((option) => (
				<option value={option.value}>{option.label}</option>
			))}
		</select>
	)
}
