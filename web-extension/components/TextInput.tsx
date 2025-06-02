import clsx from 'clsx'
import { InputHTMLAttributes, ReactNode } from 'react'

export function TextInput({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>): ReactNode {
	return <input {...props} className={clsx(className, 'rounded! bg-zinc-950! px-2 py-1')} />
}
