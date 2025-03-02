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
import { cloneElement, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'

interface PopperProps {
	popperClassName?: string
	placement?: Placement
	distance?: number
	padding?: number
	allowedPlacements?: Placement[]
	fallbackPlacements?: Placement[]
	hoverDelay?: number
	arrowClassName?: string
	arrowLeftClassName?: string
	arrowRightClassName?: string
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
	arrowLeftClassName = arrowClassName,
	arrowRightClassName = arrowClassName,
	isOpen,
	content,
	children
}: PopperProps): ReactNode {
	const [isOpen2, setIsOpen2] = useState<boolean>(isOpen ?? false)
	const hoverDelayTimeoutId = useRef<number>(0)
	const arrowRef = useRef<SVGSVGElement>(null)

	const allowedPlacements2 = [...allowedPlacements]
	if (placement !== undefined) {
		allowedPlacements2.push(placement)
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
				allowedPlacements: allowedPlacements2
			}),
			flip({
				fallbackPlacements
			}),
			arrow({
				element: arrowRef,
				padding: 10
			})
		],
		open: isOpen2,
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

	const hover = useHover(context, {
		enabled: isOpen === undefined,
		restMs: hoverDelay,
		move: false
	})
	const { getReferenceProps, getFloatingProps } = useInteractions([hover])

	switch (styles.transformOrigin) {
		case 'left':
			if (arrowLeftClassName !== undefined) {
				arrowClassName = arrowLeftClassName
			}
			break
		case 'right':
			if (arrowRightClassName !== undefined) {
				arrowClassName = arrowRightClassName
			}
			break
	}

	useEffect(() => {
		window.clearTimeout(hoverDelayTimeoutId.current)
		if (isOpen) {
			hoverDelayTimeoutId.current = window.setTimeout(setIsOpen2, hoverDelay, isOpen)
		} else {
			setIsOpen2(false)
		}
	}, [isOpen])

	useEffect(() => {
		return () => {
			window.clearTimeout(hoverDelayTimeoutId.current)
		}
	}, [])

	return (
		<>
			{cloneElement(children, {
				ref: refs.setReference,
				...getReferenceProps()
			})}

			{isOpen2 && isMounted && (
				<FloatingPortal>
					<div
						role="dialog"
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
