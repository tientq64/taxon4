import clsx from 'clsx'
import {
	CSSProperties,
	ReactElement,
	ReactNode,
	useCallback,
	useMemo,
	useRef,
	useState
} from 'react'
import { useNanoId } from '../hooks/useNanoId'
import { Icon } from './Icon'
import { InteractionType, Popper, PopperRef } from './Popper'
import { SelectItemElem } from './SelectItemElem'

export enum SelectItemType {
	Option = 'option',
	Divider = 'divider'
}

export interface SelectItem {
	type?: SelectItemType
	label?: any
	value?: any
	icon?: string | ReactElement
	description?: string | ReactElement
	className?: string
	style?: CSSProperties
}

interface SelectProps {
	className?: string
	fill?: boolean
	value: any
	onChange?: (value: any) => void
	items: SelectItem[]
}

export function Select({ className, fill, value, onChange, items }: SelectProps): ReactNode {
	const [hoveredItem, setHoveredItem] = useState<SelectItem | undefined>()
	const [popperOffset, setPopperOffset] = useState<number | undefined>()
	const popperRef = useRef<PopperRef>(null)
	const selectedItemClass: string = useNanoId()

	const hasIconItem = useMemo<boolean>(() => {
		return items.some((item) => item.icon !== undefined)
	}, [items])

	const selectedItem = useMemo<SelectItem | undefined>(() => {
		return items.find((item) => Object.is(item.value, value))
	}, [items])

	const handleItemSelect = (item: SelectItem): void => {
		onChange?.(item.value)
		popperRef.current?.setIsOpen(false)
	}

	const handleReferenceBlur = (): void => {
		popperRef.current?.setIsOpen(false)
	}

	const handleIsOpenChange = useCallback((isOpen: boolean): void => {
		if (!isOpen) return
		requestAnimationFrame(() => {
			const selectedItemEl = document.querySelector<HTMLElement>(`.${selectedItemClass}`)
			if (selectedItemEl === null) return
			selectedItemEl.scrollIntoView({
				behavior: 'instant',
				block: 'center'
			})
			const { offsetTop, offsetHeight } = selectedItemEl
			setPopperOffset(-offsetTop - offsetHeight - 1)
		})
	}, [])

	return (
		<Popper
			ref={popperRef}
			popperClassName={clsx(
				'w-[calc(100%+2px)] bg-zinc-800 rounded z-40 p-1 shadow-lg shadow-zinc-950/80 cursor-default',
				popperOffset === undefined && 'invisible'
			)}
			hideArrow
			sameWidth
			distance={popperOffset}
			interactionType={InteractionType.Click}
			transitionDuration={0}
			onOpenChange={handleIsOpenChange}
			content={() => (
				<div>
					<div className="scrollbar-thin max-h-[45vh] overflow-x-hidden">
						{items.map((item, index) => {
							const selected: boolean = Object.is(item.value, value)
							return (
								<SelectItemElem
									key={index}
									item={item}
									className={clsx(selected && selectedItemClass)}
									selected={selected}
									hasIcon={hasIconItem}
									onItemHover={setHoveredItem}
									onItemSelect={handleItemSelect}
								/>
							)
						})}
					</div>
					{hoveredItem?.description && (
						<div className="mt-1 border-t border-zinc-600 px-3 pt-1 text-sm leading-tight text-zinc-400">
							{hoveredItem.description}
						</div>
					)}
				</div>
			)}
		>
			<button
				className={clsx(
					'relative flex h-7 cursor-pointer items-center justify-end rounded border border-zinc-600 bg-zinc-800 px-[calc(.25rem-1px)] outline-none focus:border-blue-500',
					fill && 'w-full',
					className
				)}
				onBlur={handleReferenceBlur}
			>
				{selectedItem !== undefined && (
					<SelectItemElem
						item={selectedItem}
						className="pointer-events-none flex-1 pr-1"
						hasIcon={hasIconItem}
					/>
				)}
				<Icon className="text-zinc-400" name="arrow_drop_down" />
			</button>
		</Popper>
	)
}
