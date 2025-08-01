import {
	arrow,
	autoPlacement,
	autoUpdate,
	ElementProps,
	flip,
	FloatingArrow,
	FloatingPortal,
	offset,
	Placement,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useHover,
	useInteractions,
	useTransitionStyles
} from '@floating-ui/react'
import {
	cloneElement,
	forwardRef,
	HTMLProps,
	ReactElement,
	ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { SetState } from '../App'

export enum InteractionType {
	Hover = 'hover',
	Click = 'click'
}

export interface PopperRef {
	isOpen: boolean
	setIsOpen: SetState<boolean>
}

interface PopperProps {
	popperClassName?: string
	placement?: Placement
	distance?: number
	padding?: number
	allowedPlacements?: Placement[]
	fallbackPlacements?: Placement[]
	hoverDelay?: number
	hideArrow?: boolean
	arrowClassName?: string
	arrowLeftClassName?: string
	arrowRightClassName?: string
	interactionType?: InteractionType
	popperInsideReference?: boolean
	isOpen?: boolean
	onOpenChange?: (isOpen: boolean) => void
	content: ReactElement | (() => ReactElement)
	children: ReactElement
}

const flipSides: Record<string, string> = {
	left: 'right',
	right: 'left',
	top: 'bottom',
	bottom: 'top'
}

export const Popper = forwardRef<PopperRef, PopperProps>(
	(
		{
			popperClassName,
			placement,
			distance = 0,
			padding,
			allowedPlacements = [],
			fallbackPlacements,
			hoverDelay,
			hideArrow,
			arrowClassName,
			arrowLeftClassName = arrowClassName,
			arrowRightClassName = arrowClassName,
			interactionType = InteractionType.Hover,
			popperInsideReference,
			isOpen,
			onOpenChange,
			content,
			children
		},
		ref
	): ReactNode => {
		const [isOpen2, setIsOpen2] = useState<boolean>(isOpen ?? false)
		const hoverDelayTimeoutId = useRef<number>(0)
		const arrowRef = useRef<SVGSVGElement>(null)

		const allowedPlacements2 = [...allowedPlacements]
		if (placement !== undefined) {
			allowedPlacements2.push(placement)
		}

		const handleOpenChange = (open: boolean): void => {
			setIsOpen2(open)
			onOpenChange?.(open)
		}

		const { refs, floatingStyles, context } = useFloating({
			placement,
			transform: false,
			middleware: [
				offset(distance + (hideArrow ? 0 : 5)),
				shift({
					padding,
					crossAxis: true
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
			onOpenChange: handleOpenChange,
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

		let elemPropsList: ElementProps[]
		if (interactionType === InteractionType.Hover) {
			elemPropsList = [
				useHover(context, {
					enabled: isOpen === undefined,
					restMs: hoverDelay,
					move: false
				})
			]
		} else {
			elemPropsList = [
				useClick(context, {
					enabled: isOpen === undefined
				}),
				useDismiss(context, {
					enabled: isOpen === undefined
				})
			]
		}
		const { getReferenceProps, getFloatingProps } = useInteractions(elemPropsList)

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
				setIsOpen2(false)
			}
		}, [])

		useImperativeHandle(ref, () => ({
			isOpen: isOpen2,
			setIsOpen: setIsOpen2
		}))

		const popperNode: ReactNode = isOpen2 && isMounted && (
			<div
				role="dialog"
				ref={refs.setFloating}
				className={popperClassName}
				style={{ ...floatingStyles, ...styles }}
				{...getFloatingProps()}
			>
				{typeof content === 'function' ? content() : content}
				{!hideArrow && (
					<FloatingArrow
						ref={arrowRef}
						className={arrowClassName}
						context={context}
						tipRadius={5}
					/>
				)}
			</div>
		)

		return (
			<>
				{cloneElement<HTMLProps<Element>>(children, {
					ref: refs.setReference,
					children: [children.props.children, popperInsideReference && popperNode],
					...getReferenceProps()
				})}

				{!popperInsideReference && isOpen2 && isMounted && (
					<FloatingPortal>{popperNode}</FloatingPortal>
				)}
			</>
		)
	}
)
