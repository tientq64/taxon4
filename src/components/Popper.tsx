import {
	arrow,
	autoPlacement,
	autoUpdate,
	flip,
	FloatingArrow,
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
	popperClassName?: string
	placement?: Placement
	distance?: number
	padding?: number
	allowedPlacements?: Placement[]
	fallbackPlacements?: Placement[]
	hoverDelay?: number
	arrowClassName?: string
	isOpen?: boolean
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
	popperClassName,
	placement,
	distance = 0,
	padding,
	allowedPlacements = [],
	fallbackPlacements,
	hoverDelay,
	arrowClassName,
	isOpen,
	content,
	children
}: Props): ReactNode {
	const [isOpen2, setIsOpen2] = useState<boolean>(false)
	const arrowRef = useRef(null)

	allowedPlacements = [...allowedPlacements]
	if (placement !== undefined) {
		allowedPlacements.push(placement)
	}

	const { refs, floatingStyles, context } = useFloating({
		placement,
		transform: false,
		middleware: [
			offset(distance + 5),
			shift({
				padding
			}),
			autoPlacement({
				allowedPlacements
			}),
			flip({
				fallbackPlacements
			}),
			arrow({
				element: arrowRef,
				padding: 10
			})
		],
		open: isOpen ?? isOpen2,
		onOpenChange: setIsOpen2,
		whileElementsMounted: autoUpdate
	})

	const { isMounted, styles } = useTransitionStyles(context, {
		duration: 125,
		initial: {
			transform: 'scale(0.9)',
			opacity: 0.5
		},
		common: ({ side }) => ({
			transformOrigin: flipSides[side]
		})
	})

	const hover = useHover(context, { restMs: hoverDelay })
	const { getReferenceProps, getFloatingProps } = useInteractions([hover])

	return (
		<>
			{cloneElement(children, {
				ref: refs.setReference,
				...getReferenceProps()
			})}

			{(isOpen ?? isOpen2) && isMounted && (
				<FloatingPortal>
					<div
						ref={refs.setFloating}
						className={popperClassName}
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
