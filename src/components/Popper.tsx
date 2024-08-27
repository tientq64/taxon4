import { FloatingArrow } from '@floating-ui/react'
import {
	arrow,
	autoPlacement,
	autoUpdate,
	FloatingPortal,
	offset,
	Placement,
	shift,
	useFloating,
	useHover,
	useInteractions,
	useTransitionStyles
} from '@floating-ui/react'
import { cloneElement, ReactElement, ReactNode, useRef, useState } from 'react'

type Props = {
	placement?: Placement
	allowedPlacements?: Placement[]
	distance?: number
	padding?: number
	hoverDelay?: number
	arrowClassName?: string
	content: ReactElement | (() => ReactElement)
	children: ReactElement
}

const flipSides: Record<string, string> = {
	left: 'right',
	right: 'left',
	top: 'bottom',
	bottom: 'top'
}

export function Popper({
	placement,
	allowedPlacements,
	distance = 0,
	padding,
	hoverDelay,
	arrowClassName,
	content,
	children
}: Props): ReactNode {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const arrowRef = useRef(null)

	const { refs, floatingStyles, context } = useFloating({
		placement,
		transform: false,
		middleware: [
			offset(distance + 5),
			autoPlacement({
				allowedPlacements
			}),
			shift({
				padding
			}),
			arrow({
				element: arrowRef,
				padding: 10
			})
		],
		open: isOpen,
		onOpenChange: setIsOpen,
		whileElementsMounted: autoUpdate
	})

	const { isMounted, styles } = useTransitionStyles(context, {
		duration: 125,
		common: ({ side }) => ({
			transformOrigin: flipSides[side]
		}),
		initial: {
			transform: 'scale(0.9)',
			opacity: 0.5
		}
	})

	const hover = useHover(context, { restMs: hoverDelay })
	const { getReferenceProps, getFloatingProps } = useInteractions([hover])

	return (
		<>
			{cloneElement(children, {
				ref: refs.setReference,
				...getReferenceProps()
			})}

			{isOpen && isMounted && (
				<FloatingPortal>
					<div
						ref={refs.setFloating}
						style={{ ...floatingStyles, ...styles }}
						{...getFloatingProps()}
					>
						{typeof content === 'function' ? content() : content}
						<FloatingArrow
							ref={arrowRef}
							className={arrowClassName}
							context={context}
							tipRadius={5}
						/>
					</div>
				</FloatingPortal>
			)}
		</>
	)
}
