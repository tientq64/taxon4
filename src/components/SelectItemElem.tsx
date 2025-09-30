import clsx from 'clsx'
import { ReactNode } from 'react'
import { Icon } from './Icon'
import { SelectItem, SelectItemType } from './Select'

interface SelectItemElemProps {
	item: SelectItem
	className?: string
	selected?: boolean
	hasIcon?: boolean
	onItemSelect?: (item: SelectItem) => void
}

export function SelectItemElem({
	item,
	className,
	selected,
	hasIcon,
	onItemSelect
}: SelectItemElemProps): ReactNode {
	if (item.type === SelectItemType.Divider) {
		return <div className="my-1 h-px bg-zinc-600" />
	}

	return (
		<div
			className={clsx(
				'relative flex items-center rounded px-3 py-0.5 text-left hover:bg-zinc-600',
				item.className,
				className
			)}
			style={item.style}
			onMouseDown={onItemSelect && (() => onItemSelect?.(item))}
		>
			{selected && (
				<div className="absolute left-0 h-[calc(100%-0.5rem)] w-[3px] rounded bg-blue-500" />
			)}
			{hasIcon && (
				<div className="w-8 max-w-8 pr-2 leading-0">
					{item.icon !== undefined && <Icon className="h-5" name={item.icon} />}
				</div>
			)}
			<div className="flex-1">{'label' in item ? item.label : item.value}</div>
		</div>
	)
}
